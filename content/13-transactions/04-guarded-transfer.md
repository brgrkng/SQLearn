---
title: Only if there's enough
kind: drill
dataset: empty
hints:
  - "One UPDATE can change both rows: `SET balance = balance + CASE account_id WHEN 1 THEN -400 ELSE 400 END`."
  - Add a condition that's only true when the source account can afford it, so otherwise the statement changes nothing.
---
Write a **guarded transfer** as a **single UPDATE statement** that moves money only if the source account has enough. Run it twice:

1. move **$400** from account **1** to account **2**
2. move **$400** from account **3** to account **4**

Each transfer must happen **only if** its source account has at least $400. Otherwise nothing changes. This table has no CHECK constraint to save you.

```sql setup
CREATE TABLE accounts (account_id int PRIMARY KEY, balance numeric(12,2) NOT NULL);
INSERT INTO accounts VALUES (1, 500), (2, 100), (3, 50), (4, 0);
```

```sql solution
UPDATE accounts
SET balance = balance + CASE account_id WHEN 1 THEN -400 ELSE 400 END
WHERE account_id IN (1, 2)
  AND (SELECT balance FROM accounts WHERE account_id = 1) >= 400;

UPDATE accounts
SET balance = balance + CASE account_id WHEN 3 THEN -400 ELSE 400 END
WHERE account_id IN (3, 4)
  AND (SELECT balance FROM accounts WHERE account_id = 3) >= 400;
```

```sql check Final balances
SELECT account_id, balance FROM accounts;
```

```sql wrong
UPDATE accounts SET balance = balance + CASE account_id WHEN 1 THEN -400 ELSE 400 END WHERE account_id IN (1, 2);
UPDATE accounts SET balance = balance + CASE account_id WHEN 3 THEN -400 ELSE 400 END WHERE account_id IN (3, 4);
```

```sql wrong
UPDATE accounts SET balance = balance - 400 WHERE account_id = 1 AND balance >= 400;
UPDATE accounts SET balance = balance + 400 WHERE account_id = 2;
UPDATE accounts SET balance = balance - 400 WHERE account_id = 3 AND balance >= 400;
UPDATE accounts SET balance = balance + 400 WHERE account_id = 4;
```

## Explanation
The second wrong answer guards the withdrawal but not the deposit, so account 4 receives $400 that never left account 3. Money appears from nowhere. Changing both rows in **one statement**, with one shared condition, makes the transfer all-or-nothing even without an explicit transaction. In a real system you'd also wrap it in a transaction, and check the number of rows updated (2 or 0) to tell the user whether it went through.
