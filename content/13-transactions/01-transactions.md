---
title: BEGIN, COMMIT, ROLLBACK and savepoints
kind: lesson
dataset: empty
cumulative: true
---
A **transaction** groups statements into one unit of work. It guarantees the **ACID** properties:

- **Atomicity**: all of it happens, or none of it does.
- **Consistency**: constraints hold when it commits.
- **Isolation**: concurrent transactions don't see each other's half-finished work.
- **Durability**: once committed, it survives a crash.

```sql
CREATE TABLE accounts (account_id int PRIMARY KEY, owner text NOT NULL, balance numeric(12,2) NOT NULL CHECK (balance >= 0));
INSERT INTO accounts VALUES (1, 'Ada', 500), (2, 'Alan', 100);

BEGIN;
UPDATE accounts SET balance = balance - 200 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 200 WHERE account_id = 2;
COMMIT;

SELECT * FROM accounts ORDER BY account_id;
```

Without `BEGIN`, each statement is its own transaction (*autocommit*). A crash between the two `UPDATE`s would destroy $200. Inside a transaction, either both changes become visible at `COMMIT`, or neither does.

## ROLLBACK

`ROLLBACK` throws away everything since `BEGIN`:

```sql
BEGIN;
DELETE FROM accounts;
SELECT count(*) AS inside_transaction FROM accounts;
ROLLBACK;
SELECT count(*) AS after_rollback FROM accounts;
```

## Errors abort the transaction

If any statement fails, PostgreSQL marks the whole transaction as failed. Further statements are refused until you `ROLLBACK`. Here the second transfer would overdraw account 2, so the CHECK constraint rejects it, and the first update is undone too:

```sql error
BEGIN;
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 1;
UPDATE accounts SET balance = balance - 1000 WHERE account_id = 2;
COMMIT;
```

```sql
SELECT * FROM accounts ORDER BY account_id;
```

(The editor stops at the first error. In a real client, `COMMIT` on a failed transaction reports `ROLLBACK`.)

## Savepoints: partial rollback

A **savepoint** is a marker inside a transaction that you can roll back to without abandoning the whole transaction:

```sql
BEGIN;
UPDATE accounts SET balance = balance + 10 WHERE account_id = 1;
SAVEPOINT before_bonus;
UPDATE accounts SET balance = balance + 999 WHERE account_id = 2;   -- oops
ROLLBACK TO SAVEPOINT before_bonus;
UPDATE accounts SET balance = balance + 5 WHERE account_id = 2;
COMMIT;
SELECT * FROM accounts ORDER BY account_id;
```

## Transactional DDL

In PostgreSQL, `CREATE`, `ALTER` and `DROP` are transactional too. A failed migration inside `BEGIN ... ROLLBACK` leaves no half-built schema behind:

```sql
BEGIN;
CREATE TABLE temp_report (x int);
ALTER TABLE accounts ADD COLUMN frozen boolean NOT NULL DEFAULT false;
ROLLBACK;
SELECT count(*) AS report_tables FROM information_schema.tables WHERE table_name = 'temp_report';
```

## Keep transactions short

An open transaction holds locks and keeps old row versions alive, which blocks cleanup (`VACUUM`). Never wait for user input, or call a slow external API, while a transaction is open.

> **Dialect note.** SQL Server and MySQL use `BEGIN TRANSACTION` / `START TRANSACTION`. Oracle starts a transaction implicitly with the first statement and has no autocommit by default in many tools. MySQL (and Oracle) **implicitly commit** before most DDL, so a failed migration can leave a half-changed schema. PostgreSQL's transactional DDL is a genuine advantage.
