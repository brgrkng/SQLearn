import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  optimizeDeps: { exclude: ['@electric-sql/pglite'] },
  worker: { format: 'es' },
  // ponytail: each worker holds its own dataset snapshots (~0.5 GB), so cap parallelism.
  test: { testTimeout: 300_000, hookTimeout: 120_000, maxWorkers: 6 },
})
