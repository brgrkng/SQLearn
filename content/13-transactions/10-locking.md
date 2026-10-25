---
title: Locks, queues, deadlocks and optimistic concurrency
kind: lesson
dataset: empty
cumulative: true
---
## Row locks

`UPDATE` and `DELETE` lock the rows they change until the transaction ends. A second transaction trying to change the same row **waits**. `SELECT ... FOR UPDATE` takes the same lock without changing anything. It means "I'm about to change this, don't let anyone else":

```sql
CREATE TABLE seats (seat_id int PRIMARY KEY, holder text);
INSERT INTO seats SELECT g, NULL FROM generate_series(1, 5) g;

BEGIN;
SELECT * FROM seats WHERE seat_id = 3 FOR UPDATE;   -- other sessions now wait to change seat 3
UPDATE seats SET holder = 'Ada' WHERE seat_id = 3;
COMMIT;
SELECT * FROM seats ORDER BY seat_id;
```

Variants: `FOR SHARE` (others can read-lock but not change the row), `NOWAIT` (fail immediately instead of waiting), and `SKIP LOCKED` (silently skip rows someone else has locked).

## A job queue with SKIP LOCKED

Several workers pull jobs from one table. Each must get a *different* job without blocking the others:

```sql
CREATE TABLE jobs (job_id int PRIMARY KEY, status text NOT NULL DEFAULT 'queued', worker text);
INSERT INTO jobs (job_id) SELECT generate_series(1, 6);

UPDATE jobs SET status = 'running', worker = 'w1'
WHERE job_id = (
  SELECT job_id FROM jobs
  WHERE status = 'queued'
  ORDER BY job_id
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
RETURNING job_id;
```

Worker 2 running the same statement at the same moment skips job 1, which worker 1 has locked, and takes job 2. No double processing and no waiting. This is how robust Postgres-backed queues (Que, Oban, graphile-worker, and others) work.

## Deadlocks

| step | T1 | T2 |
|---|---|---|
| 1 | `UPDATE accounts ... WHERE id = 1;` (locks row 1) | `UPDATE accounts ... WHERE id = 2;` (locks row 2) |
| 2 | `UPDATE accounts ... WHERE id = 2;` waits for T2 | `UPDATE accounts ... WHERE id = 1;` waits for T1 |
| 3 | | PostgreSQL detects the cycle and aborts one: `ERROR: deadlock detected` |

The cure is a **consistent lock order**. If every transfer locks the lower account id first, a cycle can't form:

```sql
CREATE TABLE accounts (account_id int PRIMARY KEY, balance numeric(12,2) NOT NULL);
INSERT INTO accounts VALUES (1, 500), (2, 100);
BEGIN;
SELECT account_id FROM accounts WHERE account_id IN (2, 1) ORDER BY account_id FOR UPDATE;   -- lock in id order
UPDATE accounts SET balance = balance - 50 WHERE account_id = 2;
UPDATE accounts SET balance = balance + 50 WHERE account_id = 1;
COMMIT;
SELECT * FROM accounts ORDER BY account_id;
```

## Optimistic concurrency

Locks are *pessimistic*: they assume a conflict will happen. When conflicts are rare, such as two people editing the same document, use a **version column** and only apply the update if nobody changed the row since you read it:

```sql
CREATE TABLE docs (doc_id int PRIMARY KEY, body text NOT NULL, version int NOT NULL DEFAULT 1);
INSERT INTO docs VALUES (1, 'Draft', 1);

-- I read version 1 earlier. Save only if it's still version 1:
UPDATE docs SET body = 'Final', version = version + 1
WHERE doc_id = 1 AND version = 1
RETURNING version;
```

If someone else saved first, the `WHERE` matches nothing, and the application sees zero rows updated and tells the user to reload. No locks are held while the user is thinking.

## Advisory locks

`pg_advisory_xact_lock(key)` locks an arbitrary number of your choosing, for the rest of the transaction. Use it to make sure only one instance of a cron job or migration runs at a time.

> **Dialect note.** `SELECT ... FOR UPDATE` is widely supported. `SKIP LOCKED` exists in PostgreSQL 9.5+, MySQL 8, Oracle, and SQL Server (`WITH (READPAST, UPDLOCK)` hints). Every database detects deadlocks and aborts a victim. Optimistic concurrency with version columns is a portable application pattern, and ORMs like Hibernate and Entity Framework support it directly.
