import { useState } from 'react'
import { marked } from 'marked'
import { Editor } from './Editor'
import { Output } from './Results'
import { runSql } from './sql'
import type { RunOutput, Table } from './grader'
import { lessonBlocks, type Item } from './content'

export const Markdown = ({ md }: { md: string }) => <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(md) as string }} />

type Segment = { md: string } | { sql: string; setup?: string }
function segments(item: Item): Segment[] {
  const out: Segment[] = []
  let last = 0
  for (const b of lessonBlocks(item)) {
    out.push({ md: item.body.slice(last, b.start) }, { sql: b.sql, setup: b.setup })
    last = b.end
  }
  out.push({ md: item.body.slice(last) })
  return out
}

export function LessonView({ item, tables, done, onDone }: { item: Item; tables?: Table[]; done: boolean; onDone: () => void }) {
  return (
    <article className="lesson">
      {segments(item).map((s, i) => ('md' in s ? <Markdown key={i} md={s.md} /> : <Runnable key={i} sql={s.sql} setup={s.setup} dataset={item.dataset} tables={tables} />))}
      <div className="lesson-foot">
        <button className="primary" onClick={onDone}>{done ? 'Next →' : 'Mark as read & continue →'}</button>
      </div>
    </article>
  )
}

function Runnable({ sql: initial, setup, dataset, tables }: { sql: string; setup?: string; dataset: string; tables?: Table[] }) {
  const [sql, setSql] = useState(initial)
  const [key, setKey] = useState(0)
  const [out, setOut] = useState<RunOutput | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    setBusy(true)
    setError(null)
    try {
      setOut(await runSql(dataset, sql, setup))
    } catch (e: any) {
      setError(e.message)
    }
    setBusy(false)
  }

  return (
    <div className="runnable">
      <Editor key={key} initial={initial} onChange={setSql} onRun={run} tables={tables} autoFocus={false} />
      <div className="toolbar">
        <button onClick={run} disabled={busy}>{busy ? 'Running…' : '▶ Run'}</button>
        {sql !== initial && <button className="ghost" onClick={() => { setSql(initial); setKey(k => k + 1) }}>Reset</button>}
        <span className="kbd-hint">Ctrl+Enter</span>
      </div>
      {error && <div className="sql-error">{error}</div>}
      {out && <Output out={out} />}
    </div>
  )
}
