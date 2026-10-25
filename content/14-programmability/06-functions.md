---
title: Functions and procedures
kind: lesson
dataset: empty
cumulative: true
---
## SQL functions

A function wraps an expression or query behind a name and parameters:

```sql
CREATE FUNCTION price_with_vat(net numeric, rate numeric DEFAULT 0.20)
RETURNS numeric
LANGUAGE sql IMMUTABLE
RETURN round(net * (1 + rate), 2);

SELECT price_with_vat(10), price_with_vat(10, 0.05);
```

Functions can return a whole table:

```sql
CREATE TABLE orders (order_id int PRIMARY KEY, customer_id int NOT NULL, total numeric(10,2) NOT NULL);
INSERT INTO orders VALUES (1, 7, 30), (2, 7, 45), (3, 8, 12);

CREATE FUNCTION orders_of(cust int)
RETURNS TABLE (order_id int, total numeric)
LANGUAGE sql STABLE
AS $$
  SELECT order_id, total FROM orders WHERE customer_id = cust ORDER BY order_id
$$;

SELECT * FROM orders_of(7);
```

`$$ ... $$` is **dollar quoting**: a string literal that doesn't need its single quotes escaped. It's the standard way to write function bodies.

## Volatility

Tell PostgreSQL how a function behaves, so it can optimise calls safely:

- `IMMUTABLE`: same inputs, same output, forever, like `price_with_vat`. Required for use in indexes and generated columns.
- `STABLE`: same output within one statement. Can read tables, like `orders_of`.
- `VOLATILE` (the default): may return something different on every call, or change data, like `random()`, `now()` or anything that writes.

Declaring something `IMMUTABLE` when it isn't leads to wrong results, for example in an index, so be honest.

## PL/pgSQL

For logic with variables, branches, loops and errors, use **PL/pgSQL**:

```sql
CREATE TABLE accounts (account_id int PRIMARY KEY, balance numeric(12,2) NOT NULL);
INSERT INTO accounts VALUES (1, 100);

CREATE FUNCTION withdraw(acct int, amount numeric)
RETURNS numeric
LANGUAGE plpgsql
AS $$
DECLARE
  new_balance numeric;
BEGIN
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive, got %', amount;
  END IF;

  UPDATE accounts SET balance = balance - amount
  WHERE account_id = acct AND balance >= amount
  RETURNING balance INTO new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient funds in account %', acct;
  END IF;

  RETURN new_balance;
END
$$;

SELECT withdraw(1, 30) AS balance_after;
```

```sql error
SELECT withdraw(1, 500);
```

Key pieces: `DECLARE` for variables; `IF / ELSIF / ELSE`; `FOR row IN query LOOP ... END LOOP`; `SELECT ... INTO var` and `RETURNING ... INTO var`; the `FOUND` flag after DML; `RAISE EXCEPTION` (SQLSTATE `P0001`) to abort; and `RAISE NOTICE` for debugging output.

## Procedures

A **procedure** (`CREATE PROCEDURE`, called with `CALL`) is like a function that returns nothing, but it can `COMMIT` and `ROLLBACK` **inside** itself. That's useful for batch jobs that process millions of rows in chunks:

```sql
CREATE PROCEDURE add_interest(rate numeric)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE accounts SET balance = round(balance * (1 + rate), 2);
END
$$;

CALL add_interest(0.01);
SELECT * FROM accounts;
```

## Should logic live in the database?

It's good for **data rules** that must hold for every client (validation, integrity, audit), and for logic that is mostly set-based SQL. It's poor for business workflows that change weekly, call external services, or need the tooling (tests, deploys, debuggers) your application language has. Functions are code: keep them in version control and ship them through migrations.

> **Dialect note.** SQL Server uses T-SQL (`CREATE PROCEDURE ... AS BEGIN ... END`, `@variables`). Oracle uses PL/SQL, and PL/pgSQL is closely modelled on it. MySQL has stored procedures with its own syntax. PostgreSQL can also run functions written in Python, Perl, JavaScript and others via extensions.
