---
title: Withdraw with rules
kind: drill
dataset: empty
hints:
  - "Use `UPDATE ... WHERE balance >= amount RETURNING balance INTO new_balance`, then `IF NOT FOUND THEN RAISE EXCEPTION ...`."
---
Create a PL/pgSQL function `withdraw(acct int, amount numeric)` that subtracts `amount` from the account and returns the **new balance**. It must raise an exception if the amount is **not positive**, or if the account **doesn't have enough** money (or doesn't exist). In those cases nothing changes.

```sql setup
CREATE TABLE accounts (account_id int PRIMARY KEY, balance numeric(12,2) NOT NULL);
INSERT INTO accounts VALUES (1, 100), (2, 20);
```

```sql solution
CREATE FUNCTION withdraw(acct int, amount numeric) RETURNS numeric
LANGUAGE plpgsql AS $$
DECLARE
  new_balance numeric;
BEGIN
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;
  UPDATE accounts SET balance = balance - amount
  WHERE account_id = acct AND balance >= amount
  RETURNING balance INTO new_balance;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;
  RETURN new_balance;
END
$$;
```

```sql check A valid withdrawal returns the new balance
SELECT withdraw(1, 30);
```

```sql check Overdrafts raise an exception
SELECT withdraw(2, 50);
```

```sql check Negative amounts raise an exception
SELECT withdraw(1, -5);
```

```sql check Unknown accounts raise an exception
SELECT withdraw(99, 1);
```

```sql check Balances after the checks
SELECT account_id, balance FROM accounts;
```

```sql wrong
CREATE FUNCTION withdraw(acct int, amount numeric) RETURNS numeric
LANGUAGE plpgsql AS $$
DECLARE
  new_balance numeric;
BEGIN
  UPDATE accounts SET balance = balance - amount WHERE account_id = acct RETURNING balance INTO new_balance;
  RETURN new_balance;
END
$$;
```
