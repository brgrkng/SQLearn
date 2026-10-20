// Grades every exercise's reference solution (must pass), its starter and its
// known-wrong answers (must fail), and runs every lesson example.
import { describe, expect, it } from 'vitest'
import { modules } from '../src/content'
import { compareRows, grade, run } from '../src/grader'

it('compares result sets', () => {
  expect(compareRows([[1, 'a'], [2, 'b']], [[2, 'b'], [1, 'a']], false)).toBeNull()
  expect(compareRows([[1, 'a'], [2, 'b']], [[2, 'b'], [1, 'a']], true)).toMatch(/Row 1 differs/)
  expect(compareRows([['2.50']], [[2.5]], true)).toBeNull()
  expect(compareRows([[1], [1]], [[1], [2]], false)).toMatch(/\(2\)/)
  expect(compareRows([[1]], [], false)).toMatch(/Expected 1 row, got 0/)
})

const LESSON_SQL = /^```sql([^\n]*)\n([\s\S]*?)^```[ \t]*$/gm

for (const mod of modules) {
  describe(mod.id, () => {
    for (const item of mod.items) {
      const ex = item.exercise
      if (!ex) {
        const blocks = [...item.body.matchAll(LESSON_SQL)].filter(m => !m[1].includes('norun'))
        if (blocks.length) it(`${item.id}: examples run`, async () => {
          for (const [, info, sql] of blocks) {
            const out = await run(item.dataset, sql)
            if (info.includes('error')) expect(out.error, sql).toBeDefined()
            else expect(out.error?.message, sql).toBeUndefined()
          }
        })
        continue
      }
      it(`${item.id}: reference passes; starter and wrong answers fail`, async () => {
        const ok = await grade(ex, ex.solution)
        expect(ok.pass, ok.messages.join('\n')).toBe(true)
        // An empty expected result usually means the prompt references data that doesn't exist.
        if (!ex.checks.length) expect(ok.expected?.rowCount, 'reference returns no rows').toBeGreaterThan(0)
        for (const sql of [item.starter, ...item.wrong].filter(Boolean)) {
          const v = await grade(ex, sql)
          expect(v.pass, `should fail:\n${sql}`).toBe(false)
        }
      })
    }
  })
}
