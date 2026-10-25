// Grades every exercise's reference solution (must pass), its starter and its
// known-wrong answers (must fail), and runs every lesson example.
// One test file per module (test/modules) so vitest runs modules in parallel.
import { describe, expect, it } from 'vitest'
import { lessonBlocks, modules } from '../src/content'
import { grade, run } from '../src/grader'

export function testModule(id: string) {
  const mod = modules.find(m => m.id === id)
  if (!mod) throw new Error(`No module "${id}"`)
  describe(mod.id, () => {
    for (const item of mod.items) {
      const ex = item.exercise
      if (!ex) {
        const blocks = lessonBlocks(item)
        if (blocks.length) it(`${item.id}: examples run`, async () => {
          for (const b of blocks) {
            const out = await run(item.dataset, b.sql, b.setup)
            if (b.error) expect(out.error, b.sql).toBeDefined()
            else expect(out.error?.message, b.sql).toBeUndefined()
          }
        })
        continue
      }
      it(`${item.id}: reference passes; starter and wrong answers fail`, async () => {
        const ok = await grade(ex, ex.solution)
        expect(ok.pass, ok.messages.join('\n')).toBe(true)
        // An empty expected result usually means the prompt references data that doesn't exist.
        if (!ex.checks.length && !ex.explain) expect(ok.expected?.rowCount, 'reference returns no rows').toBeGreaterThan(0)
        for (const sql of [item.starter, ...item.wrong].filter(Boolean)) {
          const v = await grade(ex, sql)
          expect(v.pass, `should fail:\n${sql}`).toBe(false)
        }
      })
    }
  })
}
