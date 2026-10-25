---
title: Upserts, MERGE and data-modifying CTEs
kind: lesson
---
## INSERT ... ON CONFLICT

"Insert this row, or update it if it already exists" is called an **upsert**. PostgreSQL does it atomically with `ON CONFLICT`, which needs a unique constraint or primary key to detect the conflict:

```sql
CREATE TABLE daily_stats (day date PRIMARY KEY, orders int NOT NULL);
INSERT INTO daily_stats VALUES ('2026-01-01', 10);

INSERT INTO daily_stats (day, orders)
VALUES ('2026-01-01', 5), ('2026-01-02', 7)
ON CONFLICT (day) DO UPDATE SET orders = daily_stats.orders + EXCLUDED.orders;

SELECT * FROM daily_stats ORDER BY day;
```

`EXCLUDED` refers to the row you tried to insert, and the table name refers to the row already there. `ON CONFLICT DO NOTHING` simply skips rows that would conflict, which is handy for "insert if missing":

```sql
INSERT INTO categories (category_id, name, parent_id)
VALUES (1, 'Electronics', NULL), (27, 'Smart Home', 1)
ON CONFLICT DO NOTHING
RETURNING *;
```

Only the new row comes back. Upserts are safe under concurrency: two sessions upserting the same key can't both insert it.

## MERGE

`MERGE` (standard SQL, PostgreSQL 15+) synchronises a target table with a source, with separate actions for matched and unmatched rows. It can update, insert and delete in a single statement:

```sql
CREATE TABLE warehouse (product_id int PRIMARY KEY, qty int NOT NULL);
INSERT INTO warehouse VALUES (1, 10), (2, 20), (3, 30);

CREATE TABLE feed (product_id int, qty int, gone boolean);
INSERT INTO feed VALUES (1, 15, false), (3, 0, true), (4, 40, false);

MERGE INTO warehouse w
USING feed f ON f.product_id = w.product_id
WHEN MATCHED AND f.gone THEN DELETE
WHEN MATCHED THEN UPDATE SET qty = f.qty
WHEN NOT MATCHED AND NOT f.gone THEN INSERT (product_id, qty) VALUES (f.product_id, f.qty);

SELECT * FROM warehouse ORDER BY product_id;
```

`WHEN` clauses are checked in order, and the first one that matches wins. Use `ON CONFLICT` for single-row upserts from an application, and `MERGE` for bulk synchronisation from a staging table.

## Data-modifying CTEs

In PostgreSQL, a CTE can contain `INSERT`, `UPDATE` or `DELETE ... RETURNING`, and the main statement can use the returned rows. That lets you **move** rows atomically: delete them from one table and insert them into another in one statement:

```sql
CREATE TABLE archived_items (LIKE order_items);

WITH moved AS (
  DELETE FROM order_items oi
  USING orders o
  WHERE o.order_id = oi.order_id AND o.status = 'cancelled' AND o.order_date < '2022-03-01'
  RETURNING oi.*
)
INSERT INTO archived_items SELECT * FROM moved;

SELECT count(*) AS archived FROM archived_items;
```

All parts of the statement see the same snapshot of the data, and they succeed or fail together.

> **Dialect note.** MySQL's upsert is `INSERT ... ON DUPLICATE KEY UPDATE`, and SQLite supports PostgreSQL's `ON CONFLICT` syntax. `MERGE` exists in SQL Server, Oracle and Db2, but SQL Server's version has a long history of concurrency bugs, and careful teams use explicit `UPDATE` + `INSERT` in a transaction instead. Data-modifying CTEs are PostgreSQL-specific.
