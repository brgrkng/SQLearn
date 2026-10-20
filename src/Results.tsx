import { useState } from 'react'
import type { ResultSet, RunOutput, Verdict } from './grader'

const cell = (v: unknown) =>
  v === null ? <span className="null">NULL</span> : typeof v === 'object' ? JSON.stringify(v) : String(v)

export function Table({ set }: { set: ResultSet }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{set.columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
        <tbody>
          {set.rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{cell(v)}</td>)}</tr>)}
        </tbody>
      </table>
      <div className="table-foot">
        {set.rowCount} row{set.rowCount === 1 ? '' : 's'}
        {set.rowCount > set.rows.length && ` (showing first ${set.rows.length})`}
      </div>
    </div>
  )
}

export function Output({ out }: { out: RunOutput }) {
  return (
    <div className="output">
      {out.results.map((r, i) =>
        r.columns.length > 0
          ? <Table key={i} set={r} />
          : <div key={i} className="command">{r.command ?? 'OK'}{r.affected ? ` · ${r.affected} row${r.affected === 1 ? '' : 's'} affected` : ''}</div>,
      )}
      {out.error && (
        <div className="sql-error">
          <strong>ERROR</strong>{out.error.code && <code>{out.error.code}</code>} {out.error.message}
          {out.error.detail && <div>Detail: {out.error.detail}</div>}
          {out.error.hint && <div>Hint: {out.error.hint}</div>}
        </div>
      )}
      {out.cost !== undefined && !out.error && <div className="cost-line">Estimated plan cost: <b>{fmt(out.cost)}</b></div>}
    </div>
  )
}

export function VerdictPanel({ v }: { v: Verdict }) {
  const [tab, setTab] = useState<'yours' | 'expected'>('yours')
  const title = v.pass ? 'Passed' : !v.correct ? 'Not quite' : 'Correct, but too slow'
  return (
    <div className={`verdict ${v.pass ? 'pass' : v.correct ? 'slow' : 'fail'}`}>
      <div className="verdict-head">
        <span className="verdict-title">{title}</span>
        <span className="chip">{v.correct ? '✓' : '✗'} Correct</span>
        {v.efficient !== null && <span className="chip">{v.efficient ? '✓' : '✗'} Efficient</span>}
      </div>
      {v.cost && <CostMeter {...v.cost} />}
      {v.messages.length > 0 && <ul className="messages">{v.messages.map((m, i) => <li key={i}>{m}</li>)}</ul>}
      {v.expected && (
        <>
          <div className="tabs">
            <button className={tab === 'yours' ? 'on' : ''} onClick={() => setTab('yours')}>Your result</button>
            <button className={tab === 'expected' ? 'on' : ''} onClick={() => setTab('expected')}>Expected</button>
          </div>
          {tab === 'yours' ? <Output out={v.yours} /> : <Table set={v.expected} />}
        </>
      )}
      {!v.expected && <Output out={v.yours} />}
    </div>
  )
}

// Your cost against the reference, on a log scale so 10× and 100× both read clearly.
function CostMeter({ yours, reference, limit }: { yours: number; reference: number; limit: number }) {
  const max = Math.max(yours, limit) * 1.25
  const pos = (n: number) => `${(Math.log1p(n) / Math.log1p(max)) * 100}%`
  return (
    <div className="meter" title="Estimated cost from EXPLAIN. Lower is better.">
      <div className="meter-track">
        <div className="meter-ok" style={{ width: pos(limit) }} />
        <div className="meter-mark ref" style={{ left: pos(reference) }}><span>reference {fmt(reference)}</span></div>
        <div className={`meter-mark you ${yours <= limit ? 'good' : 'bad'}`} style={{ left: pos(yours) }}><span>you {fmt(yours)}</span></div>
      </div>
    </div>
  )
}

export const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 1 })
