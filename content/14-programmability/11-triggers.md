---
title: Triggers
kind: lesson
dataset: empty
cumulative: true
---
A **trigger** runs a function automatically when rows are inserted, updated or deleted. A trigger function is a PL/pgSQL function that `RETURNS trigger`. Inside it, `NEW` is the row being written and `OLD` is the previous version.

## Keeping updated_at current

```sql
CREATE TABLE notes (
  note_id    int PRIMARY KEY,
  body       text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT '2000-01-01'
);

CREATE FUNCTION touch_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END
$$;

CREATE TRIGGER notes_touch
BEFORE UPDATE ON notes
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

INSERT INTO notes (note_id, body) VALUES (1, 'first');
UPDATE notes SET body = 'edited' WHERE note_id = 1;
SELECT note_id, body, updated_at > '2001-01-01' AS touched FROM notes;
```

- A **BEFORE** trigger can change `NEW` before it's written (or return `NULL` to skip the row).
- An **AFTER** trigger sees the final row. Use it to react: write an audit row, update another table.
- `FOR EACH ROW` runs once per affected row. `FOR EACH STATEMENT` runs once per statement.

## An audit log

```sql
CREATE TABLE accounts (account_id int PRIMARY KEY, balance numeric(12,2) NOT NULL);
CREATE TABLE account_audit (account_id int, old_balance numeric(12,2), new_balance numeric(12,2), changed_by text);

CREATE FUNCTION audit_balance() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.balance IS DISTINCT FROM OLD.balance THEN
    INSERT INTO account_audit VALUES (OLD.account_id, OLD.balance, NEW.balance, current_user);
  END IF;
  RETURN NULL;   -- the return value of an AFTER trigger is ignored
END
$$;

CREATE TRIGGER accounts_audit
AFTER UPDATE ON accounts
FOR EACH ROW EXECUTE FUNCTION audit_balance();

INSERT INTO accounts VALUES (1, 100), (2, 50);
UPDATE accounts SET balance = balance + 10;
SELECT * FROM account_audit ORDER BY account_id;
```

Because it lives in the database, the audit trail captures every change, whether it came from the application, a script or someone in a SQL console.

## Maintaining derived data

A trigger can keep a denormalized total in sync (Module 11):

```sql
CREATE TABLE carts (cart_id int PRIMARY KEY, items int NOT NULL DEFAULT 0);
CREATE TABLE cart_lines (cart_id int REFERENCES carts, sku text, qty int NOT NULL, PRIMARY KEY (cart_id, sku));

CREATE FUNCTION recount_cart() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE carts SET items = items + NEW.qty WHERE cart_id = NEW.cart_id;
  RETURN NULL;
END
$$;

CREATE TRIGGER cart_lines_count AFTER INSERT ON cart_lines
FOR EACH ROW EXECUTE FUNCTION recount_cart();

INSERT INTO carts VALUES (1);
INSERT INTO cart_lines VALUES (1, 'PEN', 2), (1, 'INK', 3);
SELECT * FROM carts;
```

(A complete version also handles `UPDATE` and `DELETE` of lines. Triggers make it easy to cover the case you thought of and miss the others.)

## Use triggers sparingly

Triggers are invisible from the statement that fires them. That makes them perfect for cross-cutting rules (audit, timestamps, integrity) and a debugging nightmare for business logic. They also run inside the triggering transaction, so a slow trigger slows down every write. Prefer constraints when they can express the rule. Use triggers when they can't, and document them.

> **Dialect note.** All major databases have triggers, with different syntax. SQL Server has only AFTER and INSTEAD OF triggers, which see `inserted`/`deleted` pseudo-tables (statement-level). MySQL supports `BEFORE`/`AFTER ... FOR EACH ROW` with `NEW`/`OLD`. Oracle's are similar to PostgreSQL's, with `:NEW` and `:OLD`.
