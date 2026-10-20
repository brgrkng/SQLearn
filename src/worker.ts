// Runs the grader off the main thread so a runaway query can be killed by terminating the worker.
import { grade, run, schemaOf, warm } from './grader'

const ops = { run, grade, schema: schemaOf, warm: (dataset: string) => warm(dataset).then(() => true) }
export type Ops = typeof ops

self.onmessage = async ({ data: { id, op, args } }: MessageEvent) => {
  try {
    postMessage({ id, value: await (ops as any)[op](...args) })
  } catch (e: any) {
    postMessage({ id, error: e?.message ?? String(e) })
  }
}
