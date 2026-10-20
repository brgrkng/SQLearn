import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { Session } from '@supabase/supabase-js'
import { modules, items, itemById, type Item, type Kind } from './content'
import { fetchProgress, record, supabase, type Progress } from './progress'
import { ExerciseView, SchemaPanel, useSchema } from './Exercise'
import { LessonView, Markdown } from './Lesson'
import './style.css'

const KIND_LABEL: Record<Kind, string> = { lesson: 'Lesson', drill: 'Drill', test: 'Test', problem: 'Problem' }

function useRoute() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const f = () => { setHash(location.hash); window.scrollTo(0, 0) }
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  return hash.replace(/^#\/?/, '').split('/')
}
const go = (path: string) => { location.hash = `/${path}` }

function App() {
  const [session, setSession] = useState<Session | null | undefined>(supabase ? undefined : null)
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])
  if (session === undefined) return null
  if (supabase && !session) return <Login />
  return <Course email={session?.user.email} />
}

function Login() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | string>('idle')
  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('sending')
    const { error } = await supabase!.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname } })
    setState(error ? error.message : 'sent')
  }
  return (
    <div className="login">
      <form onSubmit={send}>
        <div className="brand big">SQL<span>earn</span></div>
        <p>From your first SELECT to query tuning and database design.</p>
        {state === 'sent'
          ? <p className="note">Check your inbox for a sign-in link.</p>
          : <>
              <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoFocus /></label>
              <button className="primary" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Email me a sign-in link'}</button>
              {!['idle', 'sending'].includes(state) && <p className="sql-error">{state}</p>}
            </>}
      </form>
    </div>
  )
}

function Course({ email }: { email?: string }) {
  const route = useRoute()
  const [progress, setProgress] = useState<Progress>({})
  const [saveError, setSaveError] = useState<string | null>(null)
  useEffect(() => { fetchProgress().then(setProgress, e => setSaveError(e.message)) }, [])

  const save = async (item: Item, passed: boolean, sql: string | null) => {
    try {
      const entry = await record(item.id, passed, sql, progress[item.id])
      setProgress(p => ({ ...p, [item.id]: entry }))
      setSaveError(null)
    } catch (e: any) {
      setSaveError(`Couldn't save progress: ${e.message}`)
    }
  }

  const item = route[0] === 'i' ? itemById.get(`${route[1]}/${route[2]}`) : undefined
  const mod = modules.find(m => m.id === (item?.module ?? (route[0] === 'm' ? route[1] : undefined)))
  const done = items.filter(i => progress[i.id]?.passed).length

  return (
    <div className="shell">
      <header className="top">
        <a className="brand" href="#/">SQL<span>earn</span></a>
        <div className="overall" title={`${done} of ${items.length} items complete`}>
          <div className="bar"><div style={{ width: `${(done / items.length) * 100}%` }} /></div>
          <span>{done}/{items.length}</span>
        </div>
        <div className="user">
          {email ?? <span className="warn-text">Progress not saved (Supabase not configured)</span>}
          {supabase && <button className="ghost" onClick={() => supabase!.auth.signOut()}>Sign out</button>}
        </div>
      </header>
      <nav className="side">
        {modules.map((m, n) => (
          <div key={m.id} className={`side-module ${m === mod ? 'open' : ''}`}>
            <a className="side-title" href={`#/m/${m.id}`}><span className="num">{n + 1}</span>{m.title}</a>
            {m === mod && (
              <ul>
                {m.items.map(i => (
                  <li key={i.id} className={i === item ? 'here' : ''}>
                    <a href={`#/i/${i.id}`}>
                      <span className={`dot ${progress[i.id]?.passed ? 'done' : progress[i.id] ? 'tried' : ''}`} />
                      <span className={`kind ${i.kind}`}>{KIND_LABEL[i.kind][0]}</span>
                      {i.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
      <main className="main">
        {saveError && <div className="sql-error">{saveError}</div>}
        {item ? <ItemPage key={item.id} item={item} progress={progress} save={save} />
          : mod ? <ModulePage mod={mod} progress={progress} />
            : <Home progress={progress} />}
      </main>
    </div>
  )
}

function ItemPage({ item, progress, save }: { item: Item; progress: Progress; save: (i: Item, passed: boolean, sql: string | null) => void }) {
  const tables = useSchema(item.dataset)
  const idx = items.indexOf(item)
  const prev = items[idx - 1], next = items[idx + 1]
  const toNext = next ? () => go(`i/${next.id}`) : undefined
  return (
    <div className="item">
      <div className="item-head">
        <span className={`badge ${item.kind}`}>{KIND_LABEL[item.kind]}</span>
        {item.difficulty && <span className={`badge diff ${item.difficulty}`}>{item.difficulty}</span>}
        <h1>{item.title}</h1>
      </div>
      {item.kind === 'lesson'
        ? <>
            <LessonView item={item} tables={tables} done={!!progress[item.id]?.passed} onDone={() => { if (!progress[item.id]?.passed) save(item, true, null); toNext?.() }} />
            <SchemaPanel tables={tables} />
          </>
        : <ExerciseView item={item} entry={progress[item.id]} tables={tables} onResult={(p, sql) => save(item, p, sql)} onNext={toNext} />}
      <div className="pager">
        {prev ? <a href={`#/i/${prev.id}`}>← {prev.title}</a> : <span />}
        {next && <a href={`#/i/${next.id}`}>{next.title} →</a>}
      </div>
    </div>
  )
}

function ModulePage({ mod, progress }: { mod: (typeof modules)[number]; progress: Progress }) {
  return (
    <div className="module-page">
      <h1>{mod.title}</h1>
      <p className="lede">{mod.summary}</p>
      {mod.intro && <Markdown md={mod.intro} />}
      <ol className="item-list">
        {mod.items.map(i => (
          <li key={i.id}>
            <a href={`#/i/${i.id}`}>
              <span className={`dot ${progress[i.id]?.passed ? 'done' : progress[i.id] ? 'tried' : ''}`} />
              <span className={`badge ${i.kind}`}>{KIND_LABEL[i.kind]}</span>
              {i.title}
              {i.difficulty && <span className={`badge diff ${i.difficulty}`}>{i.difficulty}</span>}
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Home({ progress }: { progress: Progress }) {
  const resume = items.find(i => !progress[i.id]?.passed)
  return (
    <div className="home">
      <h1>Learn SQL properly.</h1>
      <p className="lede">
        From your first <code>SELECT</code> to window functions, schema design and query tuning, in PostgreSQL.
        Every exercise runs against a real database in your browser and is graded on two things: whether it's correct, and whether it's efficient.
      </p>
      {resume && <a className="button primary" href={`#/i/${resume.id}`}>{Object.keys(progress).length ? 'Continue' : 'Start'}: {resume.title} →</a>}
      <div className="cards">
        {modules.map((m, n) => {
          const done = m.items.filter(i => progress[i.id]?.passed).length
          return (
            <a key={m.id} className="card" href={`#/m/${m.id}`}>
              <div className="card-num">Module {n + 1}</div>
              <h2>{m.title}</h2>
              <p>{m.summary}</p>
              <div className="bar"><div style={{ width: `${(done / m.items.length) * 100}%` }} /></div>
              <div className="card-foot">{done}/{m.items.length} complete</div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
