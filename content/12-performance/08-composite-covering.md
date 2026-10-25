---
title: Composite, covering, partial and expression indexes
kind: lesson
---
## Composite indexes: column order matters

An index on `(a, b)` is sorted by `a`, then by `b` within each `a`, like a phone book sorted by last name, then first name. It can efficiently find:

- `a = ?`
- `a = ? AND b = ?`
- `a = ? AND b > ?`, and `a = ? ORDER BY b`

It **can't** efficiently find `b = ?` alone, because those entries are scattered through the whole index. The rule of thumb: **equality columns first, then the range or sort column.**

```sql
CREATE INDEX orders_status_date_idx ON orders (status, order_date);
EXPLAIN SELECT count(*) FROM orders WHERE status = 'cancelled' AND order_date >= '2025-01-01';
```

```sql
CREATE INDEX orders_date_status_idx ON orders (order_date, status);
EXPLAIN SELECT count(*) FROM orders WHERE status = 'cancelled' AND order_date >= '2025-01-01';
```

With `(status, order_date)` PostgreSQL jumps straight to "cancelled, from 2025-01-01" and reads a contiguous slice. With `(order_date, status)` it has to scan every 2025 entry and check each one's status.

## Covering indexes and index-only scans

If every column a query needs is in the index, PostgreSQL can skip the table entirely (an **Index Only Scan**). `INCLUDE` adds payload columns to an index without making them part of the sort key:

```sql
CREATE INDEX order_items_product_idx ON order_items (product_id) INCLUDE (quantity);
EXPLAIN SELECT sum(quantity) FROM order_items WHERE product_id = 77;
```

Index-only scans rely on the *visibility map*, which `VACUUM` maintains. On a table with many recent changes, PostgreSQL still has to visit the heap for rows it can't prove are visible.

## Partial indexes

An index can cover only the rows you query. A queue of pending orders is a tiny fraction of the table:

```sql
CREATE INDEX orders_pending_idx ON orders (order_date) WHERE status = 'pending';
EXPLAIN SELECT order_id, order_date FROM orders WHERE status = 'pending' ORDER BY order_date;
```

The index holds about 100 entries instead of 50,000, so it's small, cheap to maintain, and fast. The query's `WHERE` must imply the index's `WHERE` for it to be used.

## Expression indexes

An index can store the result of an expression, which makes non-sargable conditions sargable:

```sql
CREATE INDEX customers_email_lower_idx ON customers (lower(email));
ANALYZE customers;
EXPLAIN SELECT customer_id FROM customers WHERE lower(email) = 'mateo.wilson2718@example.com';
```

The query must use exactly the indexed expression. Run `ANALYZE` after creating an expression index, so the planner gathers statistics on the expression's values.

## Other index types

| Type | Use for |
|---|---|
| **GIN** | "contains" queries: `jsonb` (`@>`), arrays (`&&`, `@>`), full-text search, and trigram matching for `LIKE '%term%'` via `pg_trgm` |
| **GiST** | ranges and overlaps (`&&`), geometry, exclusion constraints |
| **BRIN** | huge, naturally ordered tables (append-only logs by time). It's tiny, and stores min/max per block range |
| **Hash** | equality only. Rarely better than a B-tree |

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX customers_last_name_trgm ON customers USING gin (last_name gin_trgm_ops);
EXPLAIN SELECT customer_id FROM customers WHERE last_name ILIKE '%chmi%';
```

> **Dialect note.** SQL Server and MySQL support composite and covering indexes (`INCLUDE` in SQL Server; MySQL's InnoDB indexes implicitly include the primary key). SQL Server has *filtered* indexes, its equivalent of partial indexes. MySQL 8 has functional indexes. GIN, GiST and BRIN are PostgreSQL-specific, with full-text and spatial index equivalents elsewhere.
