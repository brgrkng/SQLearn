---
title: A monthly fee procedure
kind: drill
dataset: empty
hints:
  - "`CREATE PROCEDURE charge_fee(fee numeric) LANGUAGE plpgsql AS $$ BEGIN ... END $$;` then `CALL charge_fee(2.50);`"
---
Create a procedure `charge_fee(fee numeric)` that subtracts the fee from every account whose balance is **at least** the fee, leaving poorer accounts alone. Then **call it** with a fee of **2.50**.

```sql setup
CREATE TABLE accounts (account_id int PRIMARY KEY, balance numeric(12,2) NOT NULL);
INSERT INTO accounts VALUES (1, 100), (2, 2.00), (3, 2.50), (4, 0);
```

```sql solution
CREATE PROCEDURE charge_fee(fee numeric)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE accounts SET balance = balance - fee WHERE balance >= fee;
END
$$;
CALL charge_fee(2.50);
```

```sql check Balances after the fee
SELECT account_id, balance FROM accounts;
```

```sql check It's a procedure
SELECT prokind FROM pg_proc WHERE proname = 'charge_fee';
```

```sql wrong
CREATE PROCEDURE charge_fee(fee numeric)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE accounts SET balance = balance - fee WHERE balance > fee;
END
$$;
CALL charge_fee(2.50);
```
