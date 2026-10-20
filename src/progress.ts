// Login and progress, stored in Supabase (table defined in supabase/schema.sql).
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined
export const supabase = url && key ? createClient(url, key, { auth: { flowType: 'pkce' } }) : null

export type Entry = { passed: boolean; sql: string | null; attempts: number }
export type Progress = Record<string, Entry>

export async function fetchProgress(): Promise<Progress> {
  if (!supabase) return {}
  const { data, error } = await supabase.from('progress').select('item_id, passed, sql, attempts')
  if (error) throw error
  return Object.fromEntries(data.map(r => [r.item_id, { passed: r.passed, sql: r.sql, attempts: r.attempts }]))
}

// Once passed, an item stays passed.
export async function record(itemId: string, passed: boolean, sql: string | null, prev?: Entry): Promise<Entry> {
  const entry = { passed: passed || !!prev?.passed, sql, attempts: (prev?.attempts ?? 0) + 1 }
  if (supabase) {
    const user = (await supabase.auth.getSession()).data.session?.user
    const { error } = await supabase.from('progress').upsert({ user_id: user?.id, item_id: itemId, ...entry, updated_at: new Date().toISOString() })
    if (error) throw error
  }
  return entry
}
