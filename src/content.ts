// Loads the course from /content. See README "Writing content" for the file format.
import { parse as parseYaml } from 'yaml'
import type { Exercise } from './grader'

const files = import.meta.glob('/content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export type Kind = 'lesson' | 'drill' | 'test' | 'problem'
export type Item = {
  id: string
  module: string
  title: string
  kind: Kind
  dataset: string
  difficulty?: 'easy' | 'medium' | 'hard'
  body: string
  explanation?: string
  hints: string[]
  starter: string
  wrong: string[] // known-wrong answers; tests assert each one fails
  cumulative: boolean // lesson examples build on the ones before them
  exercise?: Exercise
}
export type Module = { id: string; title: string; summary: string; intro: string; items: Item[] }

const KINDS: Kind[] = ['lesson', 'drill', 'test', 'problem']
const ROLE_FENCE = /^```sql[ \t]+(starter|solution|check|explain|setup|wrong)\b[ \t]*(.*)\n([\s\S]*?)^```[ \t]*$\n?/gm
const slug = (name: string) => name.replace(/\.md$/, '').replace(/^\d+-/, '')

function split(path: string, raw: string) {
  const text = raw.replace(/\r\n/g, '\n')
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!m) throw new Error(`${path}: missing frontmatter`)
  return { meta: (parseYaml(m[1]) ?? {}) as Record<string, any>, body: text.slice(m[0].length) }
}

function parseItem(path: string, module: string, raw: string): Item {
  const { meta, body: full } = split(path, raw)
  const id = `${module}/${slug(path.split('/').pop()!)}`
  const kind: Kind = meta.kind ?? 'lesson'
  if (!KINDS.includes(kind)) throw new Error(`${path}: unknown kind "${kind}"`)
  if (!meta.title) throw new Error(`${path}: missing title`)

  const fences: Record<string, string[]> = { starter: [], solution: [], explain: [], setup: [], wrong: [] }
  const checks: Exercise['checks'] = []
  const withoutFences = full.replace(ROLE_FENCE, (_, role: string, label: string, sql: string) => {
    if (role === 'check') checks.push({ label: label.trim() || `Check ${checks.length + 1}`, sql })
    else fences[role].push(sql.trim())
    return ''
  })
  const [body, explanation] = withoutFences.split(/^## Explanation[ \t]*$/m)
  const dataset = meta.dataset ?? 'shop'

  const item: Item = {
    id, module, kind, dataset,
    title: meta.title,
    difficulty: meta.difficulty,
    body: body.trim(),
    explanation: explanation?.trim(),
    hints: meta.hints ?? [],
    starter: fences.starter[0] ?? '',
    wrong: fences.wrong,
    cumulative: meta.cumulative ?? false,
  }
  if (kind !== 'lesson') {
    if (!fences.solution[0]) throw new Error(`${path}: exercise needs a \`\`\`sql solution block`)
    item.exercise = {
      id, dataset, checks,
      setup: fences.setup[0],
      solution: fences.solution[0],
      explain: fences.explain[0],
      ordered: meta.ordered ?? false,
      columnNames: meta.columnNames ?? false,
      costSlack: meta.costSlack,
      maxCostRatio: meta.maxCostRatio === false || meta.maxCostRatio === null ? null : (meta.maxCostRatio ?? 2),
    }
  }
  return item
}

// Runnable ```sql blocks of a lesson (```sql norun stays static; ```sql error is expected to fail).
// In a cumulative lesson each block's setup is every earlier block that isn't expected to fail.
const LESSON_SQL = /^```sql([^\n]*)\n([\s\S]*?)^```[ \t]*$/gm
export type Block = { sql: string; error: boolean; setup?: string; start: number; end: number }
export function lessonBlocks(item: Item): Block[] {
  const blocks: Block[] = []
  for (const m of item.body.matchAll(LESSON_SQL)) {
    if (m[1].includes('norun')) continue
    const prior = item.cumulative ? blocks.filter(b => !b.error).map(b => b.sql).join(';\n') : ''
    blocks.push({ sql: m[2].trim(), error: m[1].includes('error'), setup: prior || undefined, start: m.index!, end: m.index! + m[0].length })
  }
  return blocks
}

function load(): Module[] {
  const byModule = new Map<string, { meta?: Record<string, any>; intro: string; items: [string, string][] }>()
  for (const path of Object.keys(files).sort()) {
    const [, , dir, name] = path.split('/')
    if (!name) continue
    if (!byModule.has(dir)) byModule.set(dir, { intro: '', items: [] })
    const mod = byModule.get(dir)!
    if (name === '_module.md') {
      const { meta, body } = split(path, files[path])
      mod.meta = meta
      mod.intro = body.trim()
    } else mod.items.push([path, files[path]])
  }
  return [...byModule].map(([dir, mod]) => {
    const id = slug(dir)
    if (!mod.meta?.title) throw new Error(`content/${dir}: missing _module.md with a title`)
    return { id, title: mod.meta.title, summary: mod.meta.summary ?? '', intro: mod.intro, items: mod.items.map(([p, raw]) => parseItem(p, id, raw)) }
  })
}

export const modules = load()
export const items = modules.flatMap(m => m.items)
export const itemById = new Map(items.map(i => [i.id, i]))
