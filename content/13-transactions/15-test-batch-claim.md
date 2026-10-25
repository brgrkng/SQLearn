---
title: Claim a batch
kind: test
dataset: empty
---
Worker **`w9`** claims up to **3** queued jobs at once: the oldest by `enqueued_at` (ties by `job_id`), skipping any locked by other workers. Mark them `running` with worker `w9`, and return their `job_id`s.

```sql setup
CREATE TABLE jobs (job_id int PRIMARY KEY, enqueued_at timestamptz NOT NULL, status text NOT NULL, worker text);
INSERT INTO jobs VALUES
  (1, '2026-01-01 10:00+00', 'queued', NULL), (2, '2026-01-01 09:00+00', 'running', 'w1'),
  (3, '2026-01-01 09:30+00', 'queued', NULL), (4, '2026-01-01 11:00+00', 'queued', NULL),
  (5, '2026-01-01 08:00+00', 'done', 'w2'),   (6, '2026-01-01 10:00+00', 'queued', NULL),
  (7, '2026-01-01 12:00+00', 'queued', NULL);
```

```sql solution
UPDATE jobs SET status = 'running', worker = 'w9'
WHERE job_id IN (
  SELECT job_id FROM jobs
  WHERE status = 'queued'
  ORDER BY enqueued_at, job_id
  FOR UPDATE SKIP LOCKED
  LIMIT 3
)
RETURNING job_id;
```

```sql wrong
UPDATE jobs SET status = 'running', worker = 'w9'
WHERE job_id IN (
  SELECT job_id FROM jobs ORDER BY enqueued_at, job_id FOR UPDATE SKIP LOCKED LIMIT 3
)
RETURNING job_id;
```

```sql wrong
UPDATE jobs SET status = 'running', worker = 'w9'
WHERE job_id IN (
  SELECT job_id FROM jobs WHERE status = 'queued' ORDER BY job_id FOR UPDATE SKIP LOCKED LIMIT 3
)
RETURNING job_id;
```
