---
title: CREATE TABLE and choosing types
kind: lesson
cumulative: true
dataset: empty
---
```sql
CREATE TABLE books (
  book_id     int PRIMARY KEY,
  title       text NOT NULL,
  isbn        text UNIQUE,
  pages       int,
  price       numeric(8,2),
  published   date,
  in_print    boolean NOT NULL DEFAULT true,
  added_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO books (book_id, title, price, published) VALUES (1, 'SQL in Practice', 39.50, '2024-05-01');
SELECT * FROM books;
```

Each column has a **name**, a **type** and optional **constraints** (`PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `DEFAULT`, `CHECK`, `REFERENCES`). Constraints get their own module next. Here the focus is types.

## Choosing types

| Data | Use | Avoid |
|---|---|---|
| Whole numbers | `int` (±2.1 billion); `bigint` for ids and counters that may grow large; `smallint` only when space really matters | `numeric` for counts |
| Money, exact decimals | `numeric(p, s)`, e.g. `numeric(12,2)` | `real` / `double precision` (binary floats can't store 0.10 exactly); the `money` type (locale-dependent) |
| Measurements, science | `double precision` | |
| Text | `text`, or `varchar(n)` when there's a real business limit | `char(n)` (pads with spaces) |
| Yes/no | `boolean` | `int` 0/1, `'Y'`/`'N'` |
| Calendar day | `date` | text |
| A moment in time | `timestamptz` | `timestamp` without time zone for events (you lose which zone it was) |
| Durations | `interval` | integer seconds without units |
| Opaque identifiers | `uuid` | text |
| Semi-structured data | `jsonb` (Module 15) | `json` (stored as plain text), or text holding JSON |

In PostgreSQL `text` and `varchar` perform identically. `varchar(n)` is simply `text` with a length check. Pick the type that states the truth about the data, because the database then enforces it for free:

```sql error
INSERT INTO books (book_id, title, published) VALUES (2, 'Bad Date', '2024-02-30');
```

```sql error
INSERT INTO books (book_id, title, price) VALUES (3, 'Too Pricey', 1234567.00);
```

## Naming conventions

- Use `snake_case`, because unquoted names are folded to lower case anyway.
- Be consistent about singular or plural table names. This course uses plural (`orders`).
- Name the key `<thing>_id`, and name foreign keys after what they reference (`customer_id`).
- Avoid reserved words (`user`, `order`, `group`) as names. They need quoting everywhere.

## Schemas, temporary tables and CREATE TABLE AS

A **schema** is a namespace inside a database. Everything so far lived in `public`. `CREATE SCHEMA reporting;` then `CREATE TABLE reporting.daily (...)` keeps things organised and helps with permissions (Module 16).

`CREATE TEMP TABLE` creates a table that disappears at the end of the session. `CREATE TABLE ... AS SELECT ...` creates a table from a query's result (column names and types come from the query, but constraints don't):

```sql
CREATE TABLE cheap_books AS SELECT book_id, title FROM books WHERE price < 50;
SELECT * FROM cheap_books;
```

> **Dialect note.** Type names vary. SQL Server uses `nvarchar(n)`/`varchar(max)`, `bit`, `datetime2` and `datetimeoffset`. MySQL has `TINYINT(1)` for booleans and `DATETIME` vs `TIMESTAMP` (which converts to UTC). Oracle uses `NUMBER(p,s)`, `VARCHAR2` and `DATE` (which includes a time). The *principles* in the table above apply everywhere.
