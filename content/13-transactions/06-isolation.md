---
title: MVCC, isolation levels and anomalies
kind: lesson
dataset: empty
---
## MVCC: readers don't block writers

PostgreSQL uses **multi-version concurrency control**. An `UPDATE` doesn't overwrite a row in place. It writes a **new version** and marks the old one as expired. Each transaction reads from a **snapshot**: the versions that were committed when its snapshot was taken. So readers never wait for writers, and writers never wait for readers. Only two writers touching the **same row** have to wait for each other.

The hidden `xmin` column shows which transaction created each row version:

```sql
CREATE TABLE t (id int PRIMARY KEY, v int);
INSERT INTO t VALUES (1, 10);
UPDATE t SET v = 20 WHERE id = 1;
SELECT xmin, xmax, * FROM t;
```

Old versions linger until `VACUUM` removes them. That's why long-running transactions cause *bloat*.

## Isolation levels

| Level | Snapshot taken | Prevents |
|---|---|---|
| **Read Committed** (default) | at the start of **each statement** | dirty reads |
| **Repeatable Read** | at the **first statement** of the transaction | dirty reads, non-repeatable reads, phantoms (in PostgreSQL) |
| **Serializable** | like Repeatable Read, plus conflict detection | all anomalies: the result is as if transactions ran one at a time |

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT current_setting('transaction_isolation');
COMMIT;
```

## The anomalies, step by step

**Non-repeatable read** (possible in Read Committed). A transaction reads the same row twice and gets different answers:

| step | T1 | T2 |
|---|---|---|
| 1 | `BEGIN;` | |
| 2 | `SELECT balance FROM accounts WHERE id = 1;` → **500** | |
| 3 | | `UPDATE accounts SET balance = 300 WHERE id = 1; COMMIT;` |
| 4 | `SELECT balance FROM accounts WHERE id = 1;` → **300** | |

Under Repeatable Read, step 4 returns **500** again, because T1 keeps its snapshot from step 2.

**Lost update.** Two transactions read a value, compute a new one in the application, and write it back:

| step | T1 | T2 |
|---|---|---|
| 1 | `SELECT balance ... ;` → 500 | |
| 2 | | `SELECT balance ... ;` → 500 |
| 3 | `UPDATE ... SET balance = 550;` (500 + 50) | |
| 4 | `COMMIT;` | `UPDATE ... SET balance = 470;` (500 − 30) **waits** for T1's row lock, then runs |
| 5 | | `COMMIT;` → balance is **470**, and T1's +50 is lost |

Fixes:

- Do the arithmetic **in SQL** (`SET balance = balance + 50`). Under Read Committed, the second UPDATE re-reads the row after waiting, so no update is lost.
- Lock the row when you read it (`SELECT ... FOR UPDATE`, next lesson).
- Use Repeatable Read or Serializable, where T2's update fails with a **serialization error** and must be retried.
- Use optimistic concurrency (`WHERE version = ...`).

**Write skew** (only prevented by Serializable). Two doctors are on call, and the rule is "at least one must stay on call":

| step | T1 (Dr A goes off call) | T2 (Dr B goes off call) |
|---|---|---|
| 1 | `SELECT count(*) FROM on_call;` → 2, fine | `SELECT count(*) FROM on_call;` → 2, fine |
| 2 | `DELETE FROM on_call WHERE doctor = 'A';` | `DELETE FROM on_call WHERE doctor = 'B';` |
| 3 | `COMMIT;` | `COMMIT;` → nobody is on call |

Each transaction's reasoning was valid on its own snapshot, and they changed **different** rows, so no lock conflict occurred. Under **Serializable**, PostgreSQL detects the dangerous pattern and fails one of them with `ERROR: could not serialize access` (SQLSTATE `40001`).

## Serializable means retry

With Serializable (and Repeatable Read), transactions can fail with error `40001` through no fault of their own. Your application must **catch the error and retry** the whole transaction. In exchange, you can reason about each transaction as if it ran alone. It's the safest choice for complex invariants, as long as the retry loop exists.

> **Dialect note.** The standard defines four levels. PostgreSQL treats *Read Uncommitted* as Read Committed (there are never dirty reads). SQL Server defaults to locking-based Read Committed (readers can block writers) unless `READ_COMMITTED_SNAPSHOT` is on. MySQL InnoDB defaults to Repeatable Read. Oracle offers Read Committed and Serializable (which is really snapshot isolation, so write skew is possible).
