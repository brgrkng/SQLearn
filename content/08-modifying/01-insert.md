---
title: INSERT and RETURNING
kind: lesson
---
`INSERT` adds rows. **Always list the columns.** The statement then documents itself and keeps working if someone adds a column to the table later:

```sql
INSERT INTO categories (category_id, name, parent_id)
VALUES (27, 'Smart Home', 1);

SELECT * FROM categories WHERE category_id = 27;
```

Several rows go in one statement, separated by commas:

```sql
INSERT INTO categories (category_id, name, parent_id)
VALUES (27, 'Smart Home', 1),
       (28, 'Wearables', 1),
       (29, 'Board Game Expansions', 23);

SELECT * FROM categories WHERE category_id >= 27 ORDER BY category_id;
```

Columns you leave out get their **default** (`discontinued` defaults to `false`), or NULL if they have no default. Write `DEFAULT` to ask for the default explicitly.

## RETURNING

`RETURNING` hands back the inserted rows, including any values the database generated (defaults, identity columns, triggers). That saves a round trip:

```sql
INSERT INTO products (product_id, name, category_id, price, stock, added_on)
VALUES (1001, 'Acme Smart Plug', 1, 19.99, 100, '2026-01-01')
RETURNING product_id, name, discontinued;
```

## INSERT ... SELECT

The rows can come from a query instead of `VALUES`. This is the set-based way to copy, archive or transform data:

```sql
CREATE TABLE cancelled_2022 (order_id int PRIMARY KEY, customer_id int, order_date date);

INSERT INTO cancelled_2022 (order_id, customer_id, order_date)
SELECT order_id, customer_id, order_date
FROM orders
WHERE status = 'cancelled' AND order_date < '2023-01-01';

SELECT count(*) FROM cancelled_2022;
```

## Constraints say no

Inserts are checked against the table's constraints: types, `NOT NULL`, `UNIQUE`, `CHECK` and foreign keys. A violation fails the **whole statement**, and none of its rows are inserted:

```sql error
INSERT INTO categories (category_id, name, parent_id)
VALUES (30, 'Gadgets', 1),
       (31, 'Electronics', NULL);   -- 'Electronics' already exists: unique violation
```

> **Dialect note.** Multi-row `VALUES` and `INSERT ... SELECT` work everywhere. `RETURNING` is PostgreSQL, SQLite (3.35+) and MariaDB. SQL Server uses `OUTPUT inserted.*`, and Oracle uses `RETURNING ... INTO` variables in PL/SQL. MySQL has no equivalent, so you call `LAST_INSERT_ID()` instead.
