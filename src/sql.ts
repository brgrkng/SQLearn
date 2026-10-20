// Main-thread client for the SQL worker. Jobs run one at a time; a job that
// exceeds its time limit kills the worker (the only way to stop WASM Postgres).
import type { Ops } from './worker'

const LIMIT_MS = 20_000
type Pending = { resolve: (v: any) => void; reject: (e: Error) => void }

let worker: Worker
let seq = 0
const pending = new Map<number, Pending>()

function spawn() {
  worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = ({ data }) => {
    const p = pending.get(data.id)
    pending.delete(data.id)
    if (data.error) p?.reject(new Error(data.error))
    else p?.resolve(data.value)
  }
}
spawn()

function send(op: string, args: unknown[], limitMs?: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = ++seq
    pending.set(id, { resolve, reject })
    worker.postMessage({ id, op, args })
    if (limitMs) setTimeout(() => {
      if (!pending.has(id)) return
      worker.terminate()
      pending.forEach(p => p.reject(new Error(`Stopped after ${limitMs / 1000}s. The query ran too long; look for a missing join condition or an accidental cross join.`)))
      pending.clear()
      spawn()
    }, limitMs)
  })
}

let queue: Promise<unknown> = Promise.resolve()
function job<T>(dataset: string, op: keyof Ops, args: unknown[]): Promise<T> {
  // Preparing the dataset (seconds, once per session) doesn't count against the time limit.
  const next = queue.then(() => send('warm', [dataset])).then(() => send(op, args, LIMIT_MS))
  queue = next.catch(() => {})
  return next
}

type R<K extends keyof Ops> = Awaited<ReturnType<Ops[K]>>
export const runSql = (dataset: string, sql: string, setup?: string) => job<R<'run'>>(dataset, 'run', [dataset, sql, setup])
export const gradeSql = (ex: Parameters<Ops['grade']>[0], sql: string) => job<R<'grade'>>(ex.dataset, 'grade', [ex, sql])
export const schema = (dataset: string) => job<R<'schema'>>(dataset, 'schema', [dataset])
