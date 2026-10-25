---
title: Lock in a fixed order
kind: drill
dataset: empty
hints:
  - "`SELECT ... WHERE account_id IN (7, 3) ORDER BY account_id FOR UPDATE;` locks the lower id first."
---
Transfers can deadlock if two of them lock the same accounts in opposite orders. Write a transaction that moves **$25** from account **7** to account **3**. Before updating, **lock both rows in ascending `account_id` order** with `SELECT ... FOR UPDATE`, then apply both updates and commit.

```sql setup
CREATE TABLE accounts (account_id int PRIMARY KEY, balance numeric(12,2) NOT NULL);
INSERT INTO accounts SELECT g, 100 FROM generate_series(1, 8) g;
```

```sql solution
BEGIN;
SELECT account_id FROM accounts WHERE account_id IN (7, 3) ORDER BY account_id FOR UPDATE;
UPDATE accounts SET balance = balance - 25 WHERE account_id = 7;
UPDATE accounts SET balance = balance + 25 WHERE account_id = 3;
COMMIT;
```

```sql check Balances
SELECT account_id, balance FROM accounts WHERE balance <> 100;
```

```sql wrong
BEGIN;
UPDATE accounts SET balance = balance + 25 WHERE account_id = 7;
UPDATE accounts SET balance = balance - 25 WHERE account_id = 3;
COMMIT;
```
