import { useEffect, useState } from 'react'
import { Editor } from './Editor'
import { Markdown } from './Lesson'
import { Output, VerdictPanel } from './Results'
import { gradeSql, runSql, schema } from './sql'
import type { RunOutput, Table, Verdict } from './grader'
import type { Item } from './content'
import type { Entry } from './progress'

export function useSchema(dataset: string) {
  const [tables, setTables] = useState<Table[]>()
  useEffect(() => {
    setTables(undefined)
    schema(dataset).then(setTables, () => {})
  }, [dataset])
  return tables
}

type Props = { item: Item; entry?: Entry; tables?: Table[]; onResult: (passed: boolean, sql: string) => void; onNext?: () => void }

export function ExerciseView({ item, entry, tables, onResult, onNext }: Props) {
  const ex = item.exercise!
  const [sql, setSql] = useState(entry?.sql ?? item.starter)
  const [editorKey, setEditorKey] = useState(0)
  const [busy, setBusy] = useState<'run' | 'submit' | null>(null)
  const [out, setOut] = useState<RunOutput | null>(null)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [failure, setFailure] = useState<string | null>(null)
  const [hints, setHints] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const go = async (mode: 'run' | 'submit') => {
    if (busy) return
    setBusy(mode)
    setFailure(null)
    try {
      if (mode === 'run') {
        setVerdict(null)
        setOut(await runSql(ex.dataset, sql, ex.setup))
      } else {
        const v = await gradeSql(ex, sql)
        setOut(null)
        setVerdict(v)
        setAttempts(a => a + 1)
        onResult(v.pass, sql)
      }
    } catch (e: any) {
      setFailure(e.message)
    }
    setBusy(null)
  }

  const passed = verdict?.pass || entry?.passed
  const canReveal = passed || attempts + (entry?.attempts ?? 0) >= 3

  return (
    <div className="exercise">
      <section className="brief">
        <Markdown md={item.body} />
        {ex.checks.length > 0 && <p className="note">Graded by running checks against your database after your SQL runs.</p>}
        {ex.maxCostRatio !== null && <p className="note">Must also be efficient: estimated cost within {ex.maxCostRatio}× the reference solution.</p>}
        {ex.setup && <details className="schema" open><summary>Setup (already run before your SQL)</summary><pre><code>{ex.setup}</code></pre></details>}
        {item.hints.length > 0 && (
          <div className="hints">
            {item.hints.slice(0, hints).map((h, i) => <div key={i} className="hint"><b>Hint {i + 1}.</b> <Markdown md={h} /></div>)}
            {hints < item.hints.length && <button className="ghost" onClick={() => setHints(h => h + 1)}>Show a hint ({hints}/{item.hints.length})</button>}
          </div>
        )}
        {passed && item.explanation && <div className="explanation"><h3>Why it works</h3><Markdown md={item.explanation} /></div>}
        {canReveal && (
          showSolution
            ? <div className="solution"><h3>Reference solution</h3><pre><code>{ex.solution}</code></pre></div>
            : <button className="ghost" onClick={() => setShowSolution(true)}>Show the reference solution</button>
        )}
        <SchemaPanel tables={tables} />
      </section>

      <section className="work">
        <Editor key={editorKey} initial={sql} onChange={setSql} onRun={() => go('run')} onSubmit={() => go('submit')} tables={tables} />
        <div className="toolbar">
          <button onClick={() => go('run')} disabled={!!busy}>{busy === 'run' ? 'Running…' : '▶ Run'}</button>
          <button className="primary" onClick={() => go('submit')} disabled={!!busy}>{busy === 'submit' ? 'Grading…' : 'Submit'}</button>
          {sql !== item.starter && <button className="ghost" onClick={() => { setSql(item.starter); setEditorKey(k => k + 1) }}>Reset</button>}
          <span className="kbd-hint">Run Ctrl+Enter · Submit Ctrl+Shift+Enter</span>
          {passed && onNext && <button className="primary next" onClick={onNext}>Next →</button>}
        </div>
        {!tables && !failure && <div className="note">Preparing the {ex.dataset} database (first time only)…</div>}
        {failure && <div className="sql-error">{failure}</div>}
        {verdict && <VerdictPanel v={verdict} />}
        {out && <Output out={out} />}
      </section>
    </div>
  )
}

export function SchemaPanel({ tables }: { tables?: Table[] }) {
  if (!tables || tables.length === 0) return null
  return (
    <details className="schema">
      <summary>Database tables</summary>
      {tables.map(t => (
        <div key={t.name} className="schema-table">
          <div className="schema-name">{t.name} <span>{t.rows.toLocaleString()} rows</span></div>
          <ul>{t.columns.map(c => <li key={c.name}><code>{c.name}</code> <span>{c.type}{c.nullable ? '' : ' · not null'}</span></li>)}</ul>
        </div>
      ))}
    </details>
  )
}
