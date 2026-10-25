---
title: An atomic transfer
kind: drill
dataset: empty
hints:
  - "`BEGIN;` two UPDATEs `COMMIT;`"
---
Move **$150** from account **1** to account **2**, so that both changes commit together or not at all.

```sql setup
CREATE TABLE accounts (account_id int PRIMARY KEY, owner text NOT NULL, balance numeric(12,2) NOT NULL CHECK (balance >= 0));
INSERT INTO accounts VALUES (1, 'Ada', 500), (2, 'Alan', 100), (3, 'Grace', 50);
```

```sql solution
BEGIN;
UPDATE accounts SET balance = balance - 150 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 150 WHERE account_id = 2;
COMMIT;
```

```sql check Balances after the transfer
SELECT account_id, balance FROM accounts;
```

```sql check Money is conserved
SELECT sum(balance) FROM accounts;
```

```sql wrong
BEGIN;
UPDATE accounts SET balance = balance - 150 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 150 WHERE account_id = 3;
COMMIT;
```
