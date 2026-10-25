// Runs learner SQL against disposable PGlite databases and grades it.
// Environment-agnostic: used by the Web Worker in the app and by the content tests in Node.
import { PGlite } from '@electric-sql/pglite'
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist'
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm'

const seeds = import.meta.glob('/datasets/*.sql', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const seedFor = (name: string): string | undefined => (name === 'empty' ? '' : seeds[`/datasets/${name}.sql`])

export type ResultSet = { command?: string; columns: string[]; rows: unknown[][]; rowCount: number; affected?: number }
export type SqlError = { message: string; code?: string; detail?: string; hint?: string; position?: number }
export type RunOutput = { results: ResultSet[]; cost?: number; error?: SqlError }
export type Table = { name: string; rows: number; columns: { name: string; type: string; nullable: boolean }[] }

export type Exercise = {
  id: string
  dataset: string
  setup?: string
  solution: string
  checks: { label: string; sql: string }[]
  explain?: string
  ordered: boolean
  columnNames: boolean
  maxCostRatio: number | null
  costSlack?: number
}

export type Verdict = {
  pass: boolean
  correct: boolean
  efficient: boolean | null
  messages: string[]
  cost?: { yours: number; reference: number; limit: number }
  yours: RunOutput
  expected?: ResultSet
}

const DISPLAY_ROWS = 500
// ponytail: fixed cost slack so tiny tables never fail on planner noise; exercises can lower it (costSlack).
const COST_SLACK = 50

// Return dates/times exactly as Postgres prints them instead of JS Dates.
const asText = (s: string) => s
const parsers = { 1082: asText, 1083: asText, 1114: asText, 1184: asText, 1186: asText, 1266: asText }
// UTC everywhere (PGlite otherwise inherits the host's zone); extensions available to CREATE EXTENSION.
const options = { parsers, postgresqlconf: "timezone = 'UTC'", extensions: { btree_gist, pg_trgm } }

// --- databases --------------------------------------------------------------

type Snapshot = { blob: Blob; schema: Table[] }
const snapshots = new Map<string, Promise<Snapshot>>()
let spare: { dataset: string; db: Promise<PGlite> } | null = null

function snapshot(dataset: string): Promise<Snapshot> {
  const seed = seedFor(dataset)
  if (seed === undefined) return Promise.reject(new Error(`Unknown dataset "${dataset}"`))
  if (!snapshots.has(dataset)) {
    snapshots.set(dataset, (async () => {
      const db = await PGlite.create(options)
      await db.exec(seed)
      await db.exec('VACUUM ANALYZE') // like a maintained production database: stats and visibility map

      const schema = await readSchema(db)
      const blob = await db.dumpDataDir('none')
      await db.close()
      return { blob, schema }
    })())
  }
  return snapshots.get(dataset)!
}

async function readSchema(db: PGlite): Promise<Table[]> {
  const cols = await db.query<{ table_name: string; column_name: string; data_type: string; is_nullable: string }>(`
    SELECT table_name, column_name, data_type, is_nullable FROM information_schema.columns
    WHERE table_schema = 'public' ORDER BY table_name, ordinal_position`)
  const tables = new Map<string, Table>()
  for (const c of cols.rows) {
    if (!tables.has(c.table_name)) tables.set(c.table_name, { name: c.table_name, rows: 0, columns: [] })
    tables.get(c.table_name)!.columns.push({ name: c.column_name, type: c.data_type, nullable: c.is_nullable === 'YES' })
  }
  for (const t of tables.values()) {
    const r = await db.query<{ n: number }>(`SELECT count(*)::int AS n FROM "${t.name}"`)
    t.rows = r.rows[0].n
  }
  return [...tables.values()]
}

export const schemaOf = async (dataset: string) => (await snapshot(dataset)).schema

// Keep one restored database ready so the next Run doesn't wait for a restore.
// Assigns `spare` synchronously so overlapping calls never leak an instance.
export function warm(dataset: string): Promise<PGlite> {
  if (spare?.dataset === dataset) return spare.db
  spare?.db.then(d => d.close(), () => {})
  const db = snapshot(dataset).then(s => PGlite.create({ ...options, loadDataDir: s.blob }))
  db.catch(() => {})
  spare = { dataset, db }
  return db
}

// A fresh database restored from the dataset snapshot.
function fresh(dataset: string): Promise<PGlite> {
  const db = warm(dataset)
  spare = null
  warm(dataset)
  return db
}

async function withDb<T>(dataset: string, setup: string | undefined, fn: (db: PGlite) => Promise<T>): Promise<T> {
  const db = await fresh(dataset)
  try {
    if (setup) await db.exec(setup)
    return await fn(db)
  } finally {
    await db.close()
  }
}

// --- executing --------------------------------------------------------------

type Full = { command?: string; columns: string[]; rows: unknown[][]; affected?: number }
type Executed = { sets: Full[]; error?: SqlError }

const toError = (e: any): SqlError => ({
  message: e?.message ?? String(e), code: e?.code, detail: e?.detail, hint: e?.hint,
  position: e?.position ? Number(e.position) : undefined,
})

async function exec(db: PGlite, sql: string): Promise<Executed> {
  try {
    const res = await db.exec(sql, { rowMode: 'array' })
    return { sets: res.map(r => ({ command: r.command, columns: r.fields.map(f => f.name), rows: r.rows as unknown[][], affected: r.affectedRows })) }
  } catch (e) {
    return { sets: [], error: toError(e) }
  }
}

const display = (s: Full): ResultSet => ({ ...s, rows: s.rows.slice(0, DISPLAY_ROWS), rowCount: s.rows.length })
const output = (x: Executed, cost?: number): RunOutput => ({ results: x.sets.map(display), error: x.error, cost })
const lastQuery = (x: Executed) => [...x.sets].reverse().find(s => s.columns.length > 0)

// The last statement of a script, skipping semicolons inside quotes, dollar quotes and comments.
export function lastStatement(sql: string): string {
  const statements: string[] = []
  let start = 0, i = 0
  while (i < sql.length) {
    const c = sql[i], rest = sql.slice(i)
    if (c === "'" || c === '"') {
      const end = sql.indexOf(c, i + 1)
      i = end < 0 ? sql.length : end + 1
    } else if (rest.startsWith('--')) {
      const end = sql.indexOf('\n', i)
      i = end < 0 ? sql.length : end + 1
    } else if (rest.startsWith('/*')) {
      const end = sql.indexOf('*/', i + 2)
      i = end < 0 ? sql.length : end + 2
    } else if (c === '$' && /^\$[A-Za-z_]*\$/.test(rest)) {
      const tag = rest.match(/^\$[A-Za-z_]*\$/)![0]
      const end = sql.indexOf(tag, i + tag.length)
      i = end < 0 ? sql.length : end + tag.length
    } else if (c === ';') {
      statements.push(sql.slice(start, i))
      start = ++i
    } else i++
  }
  statements.push(sql.slice(start))
  const meaningful = statements.filter(s => s.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, '').trim())
  return (meaningful.at(-1) ?? '').trim()
}

async function cost(db: PGlite, sql: string): Promise<number | undefined> {
  try {
    const r = await db.query<{ 'QUERY PLAN': { Plan: { 'Total Cost': number } }[] }>(`EXPLAIN (FORMAT JSON) ${lastStatement(sql)}`)
    return r.rows[0]['QUERY PLAN'][0].Plan['Total Cost']
  } catch {
    return undefined // several statements, or a statement EXPLAIN can't take
  }
}

export const run = (dataset: string, sql: string, setup?: string): Promise<RunOutput> =>
  withDb(dataset, setup, async db => {
    const x = await exec(db, sql)
    return output(x, x.error ? undefined : await cost(db, sql))
  })

// --- comparing --------------------------------------------------------------

const NUMERIC = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i
export function normValue(v: unknown): unknown {
  if (v === null || v === undefined) return null
  if (typeof v === 'bigint') return Number(v)
  if (typeof v === 'number') return Number(v.toPrecision(12))
  if (typeof v === 'string' && NUMERIC.test(v)) return Number(Number(v).toPrecision(12))
  if (typeof v === 'object') return JSON.stringify(v, (_, x) => (typeof x === 'bigint' ? Number(x) : x))
  return v
}
const rowKey = (row: unknown[]) => JSON.stringify(row.map(normValue))
export const show = (row: unknown[]) => `(${row.map(v => (v === null ? 'NULL' : typeof v === 'object' ? JSON.stringify(v) : String(v))).join(', ')})`
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

export function compareRows(expected: unknown[][], actual: unknown[][], ordered: boolean): string | null {
  if (expected.length !== actual.length) return `Expected ${plural(expected.length, 'row')}, got ${actual.length}.`
  const e = expected.map(rowKey), a = actual.map(rowKey)
  if (ordered) {
    const i = e.findIndex((k, i) => k !== a[i])
    return i < 0 ? null : `Row ${i + 1} differs: expected ${show(expected[i])}, got ${show(actual[i])}. Check your ORDER BY.`
  }
  const counts = new Map<string, number>()
  e.forEach(k => counts.set(k, (counts.get(k) ?? 0) + 1))
  for (let i = 0; i < a.length; i++) {
    const n = counts.get(a[i]) ?? 0
    if (n === 0) return `Your result contains ${show(actual[i])}, which isn't in the expected result.`
    counts.set(a[i], n - 1)
  }
  return null
}

// --- grading ----------------------------------------------------------------

const ERROR_NAMES: Record<string, string> = {
  '23505': 'a unique violation', '23503': 'a foreign key violation', '23502': 'a not-null violation',
  '23514': 'a check violation', '23P01': 'an exclusion violation', '42P01': 'an undefined table error',
  '42703': 'an undefined column error', '42501': 'a permission error', '40001': 'a serialization failure',
  '428C9': 'a "cannot insert into a generated column" error', '22P02': 'an invalid input error',
  '22001': 'a "value too long" error', '22003': 'a numeric out-of-range error', '42P07': 'a "table already exists" error',
  '2BP01': 'a "dependent objects still exist" error', '42883': 'an undefined function error', '22007': 'an invalid date error',
  'P0001': 'a raised exception', '44000': 'a WITH CHECK OPTION violation', '55000': 'an "object not in prerequisite state" error',
}
const errName = (code: string) => `${ERROR_NAMES[code] ?? 'an error'} (${code})`

// What a check statement did: the SQLSTATE it failed with, or its (sorted) rows.
type Outcome = { error?: string; rows: unknown[][] }
async function outcome(db: PGlite, sql: string): Promise<Outcome> {
  const x = await exec(db, sql)
  if (x.error) {
    // A check that failed inside BEGIN ... COMMIT leaves the session in an aborted transaction.
    await db.exec('ROLLBACK').catch(() => {})
    return { error: x.error.code ?? 'XX000', rows: [] }
  }
  return { rows: (lastQuery(x)?.rows ?? []).map(r => r.map(normValue)).sort((p, q) => (JSON.stringify(p) < JSON.stringify(q) ? -1 : 1)) }
}

type Reference = { result?: Full; checks: Outcome[]; cost?: number }
const references = new Map<string, Promise<Reference>>()

// The reference solution's behaviour, computed once per exercise.
function reference(ex: Exercise): Promise<Reference> {
  if (!references.has(ex.id)) {
    references.set(ex.id, withDb(ex.dataset, ex.setup, async db => {
      const x = await exec(db, ex.solution)
      if (x.error) throw new Error(`Reference solution for ${ex.id} failed: ${x.error.message}`)
      const c = ex.maxCostRatio === null ? undefined : await cost(db, ex.explain ?? ex.solution)
      const checks: Outcome[] = []
      for (const ch of ex.checks) checks.push(await outcome(db, ch.sql))
      return { result: lastQuery(x), checks, cost: c }
    }))
  }
  return references.get(ex.id)!
}

export async function grade(ex: Exercise, sql: string): Promise<Verdict> {
  const ref = await reference(ex)
  return withDb(ex.dataset, ex.setup, async db => {
    const yours = await exec(db, sql)
    const messages: string[] = []
    const verdict = (correct: boolean, efficient: boolean | null, c?: Verdict['cost']): Verdict => ({
      pass: correct && efficient !== false, correct, efficient, messages, cost: c,
      yours: output(yours, c?.yours), expected: ref.result && display(ref.result),
    })
    if (yours.error) {
      messages.push(`Your SQL raised an error: ${yours.error.message}`)
      return verdict(false, null)
    }

    // Cost first: checks may change the data.
    let c: Verdict['cost']
    let efficient: boolean | null = null
    if (ex.maxCostRatio !== null && ref.cost !== undefined) {
      const mine = await cost(db, ex.explain ?? sql)
      if (mine !== undefined) {
        const limit = ref.cost * ex.maxCostRatio + (ex.costSlack ?? COST_SLACK)
        c = { yours: mine, reference: ref.cost, limit }
        efficient = mine <= limit
      } else if (ex.explain) {
        efficient = false
        messages.push("The query this exercise measures couldn't run against your database. Did your SQL drop or rename something it needs?")
      }
    }

    let correct = true
    if (ex.checks.length === 0 && !ref.result) {
      // Graded on cost alone, e.g. "add an index so this query is fast".
    } else if (ex.checks.length === 0) {
      const mine = lastQuery(yours), want = ref.result!
      const problem = !mine
        ? 'Your SQL did not return a result to compare. Did you forget the SELECT?'
        : mine.columns.length !== want.columns.length
          ? `Expected ${plural(want.columns.length, 'column')} (${want.columns.join(', ')}), got ${mine.columns.length} (${mine.columns.join(', ')}).`
          : ex.columnNames && mine.columns.join() !== want.columns.join()
            ? `Expected columns named ${want.columns.join(', ')}, got ${mine.columns.join(', ')}.`
            : compareRows(want.rows, mine.rows, ex.ordered)
      if (problem) {
        correct = false
        messages.push(problem)
      }
    } else {
      for (let i = 0; i < ex.checks.length; i++) {
        const want = ref.checks[i], got = await outcome(db, ex.checks[i].sql)
        const label = ex.checks[i].label
        const problem = want.error
          ? got.error === want.error ? null : `expected ${errName(want.error)}, but ${got.error ? `got ${errName(got.error)}` : 'the statement succeeded'}.`
          : got.error ? `expected this to succeed, but it raised ${errName(got.error)}.`
            : compareRows(want.rows, got.rows, true)
        if (problem) correct = false
        messages.push(problem ? `✗ ${label}: ${problem}` : `✓ ${label}`)
      }
    }

    if (efficient === false && c) messages.push(`${ex.explain ? 'The measured query' : 'Your query'}'s estimated cost is ${fmt(c!.yours)} vs ${fmt(c!.reference)} for the reference (limit ${fmt(c!.limit)}). It works, but there's a much cheaper plan.`)
    return verdict(correct, efficient, c)
  })
}

const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 1 })
