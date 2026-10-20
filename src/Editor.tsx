import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { keymap } from '@codemirror/view'
import { Compartment, Prec } from '@codemirror/state'
import { sql, PostgreSQL } from '@codemirror/lang-sql'
import type { Table } from './grader'

type Props = {
  initial: string
  onChange: (sql: string) => void
  onRun: () => void
  onSubmit?: () => void
  tables?: Table[]
  autoFocus?: boolean
}

// Remount (change `key`) to replace the document.
export function Editor({ initial, onChange, onRun, onSubmit, tables, autoFocus = true }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView>(null)
  const language = useRef(new Compartment())
  const handlers = useRef({ onChange, onRun, onSubmit })
  handlers.current = { onChange, onRun, onSubmit }

  useEffect(() => {
    const v = new EditorView({
      doc: initial,
      parent: host.current!,
      extensions: [
        Prec.highest(keymap.of([
          { key: 'Mod-Enter', run: () => (handlers.current.onRun(), true) },
          { key: 'Shift-Mod-Enter', run: () => (handlers.current.onSubmit?.(), true) },
        ])),
        basicSetup,
        language.current.of(sql({ dialect: PostgreSQL })),
        EditorView.updateListener.of(u => { if (u.docChanged) handlers.current.onChange(u.state.doc.toString()) }),
      ],
    })
    view.current = v
    if (autoFocus) v.focus()
    return () => v.destroy()
  }, [])

  // Table and column names for autocomplete.
  useEffect(() => {
    if (!tables) return
    const schema = Object.fromEntries(tables.map(t => [t.name, t.columns.map(c => c.name)]))
    view.current?.dispatch({ effects: language.current.reconfigure(sql({ dialect: PostgreSQL, schema })) })
  }, [tables])

  return <div className="editor" ref={host} />
}
