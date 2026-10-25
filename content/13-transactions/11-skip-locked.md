---
title: Claim the next job
kind: drill
dataset: empty
hints:
  - "A subquery picks the job: `SELECT job_id FROM jobs WHERE status = 'queued' ORDER BY priority DESC, job_id FOR UPDATE SKIP LOCKED LIMIT 1`."
  - Wrap it in an `UPDATE ... WHERE job_id = (...) RETURNING job_id`.
---
Write the statement a worker named **`w7`** runs to **claim** the next job: the queued job with the highest `priority` (ties broken by the lowest `job_id`). Set its `status` to `running` and its `worker` to `w7`, and return the claimed `job_id`. Use `FOR UPDATE SKIP LOCKED` so concurrent workers never claim the same job.

```sql setup
CREATE TABLE jobs (job_id int PRIMARY KEY, priority int NOT NULL, status text NOT NULL DEFAULT 'queued', worker text);
INSERT INTO jobs VALUES (1, 1, 'done', 'w1'), (2, 5, 'queued', NULL), (3, 9, 'running', 'w2'), (4, 9, 'queued', NULL), (5, 9, 'queued', NULL);
```

```sql solution
UPDATE jobs SET status = 'running', worker = 'w7'
WHERE job_id = (
  SELECT job_id FROM jobs
  WHERE status = 'queued'
  ORDER BY priority DESC, job_id
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
RETURNING job_id;
```

```sql wrong
UPDATE jobs SET status = 'running', worker = 'w7'
WHERE job_id = (SELECT job_id FROM jobs ORDER BY priority DESC, job_id LIMIT 1)
RETURNING job_id;
```

```sql wrong
UPDATE jobs SET status = 'running', worker = 'w7'
WHERE job_id = (
  SELECT job_id FROM jobs WHERE status = 'queued' ORDER BY priority, job_id FOR UPDATE SKIP LOCKED LIMIT 1
)
RETURNING job_id;
```
