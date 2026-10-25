import { expect, it } from 'vitest'
import { modules } from '../src/content'
import { compareRows } from '../src/grader'

it('compares result sets', () => {
  expect(compareRows([[1, 'a'], [2, 'b']], [[2, 'b'], [1, 'a']], false)).toBeNull()
  expect(compareRows([[1, 'a'], [2, 'b']], [[2, 'b'], [1, 'a']], true)).toMatch(/Row 1 differs/)
  expect(compareRows([['2.50']], [[2.5]], true)).toBeNull()
  expect(compareRows([[1], [1]], [[1], [2]], false)).toMatch(/\(2\)/)
  expect(compareRows([[1]], [], false)).toMatch(/Expected 1 row, got 0/)
})

it('has a test file for every module', () => {
  const files = Object.keys(import.meta.glob('./modules/*.test.ts')).map(f => f.replace(/^.*\/|\.test\.ts$/g, ''))
  expect(files.sort()).toEqual(modules.map(m => m.id).sort())
})

it('finds the last statement of a script', async () => {
  const { lastStatement } = await import('../src/grader')
  expect(lastStatement('SELECT 1')).toBe('SELECT 1')
  expect(lastStatement('CREATE INDEX i ON t (a); SELECT 2;')).toBe('SELECT 2')
  expect(lastStatement("SELECT ';' AS x; -- trailing; comment")).toBe("SELECT ';' AS x")
  expect(lastStatement('CREATE FUNCTION f() RETURNS int AS $$ SELECT 1; $$ LANGUAGE sql; SELECT f()')).toBe('SELECT f()')
  expect(lastStatement('SELECT 1; /* a; b */')).toBe('SELECT 1')
})
