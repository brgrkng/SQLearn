---
title: B-tree indexes
kind: lesson
---
A **B-tree index** is a sorted copy of one or more columns, with pointers back to the table rows, organised as a shallow balanced tree. Finding a value means walking from the root to a leaf, which takes three or four page reads even for millions of rows, instead of reading the whole table.

Nobody has indexed `orders.customer_id`, so looking up a customer's orders reads all 50,000 rows:

```sql
EXPLAIN SELECT order_id, order_date FROM orders WHERE customer_id = 42;
```

```sql
CREATE INDEX orders_customer_id_idx ON orders (customer_id);
EXPLAIN SELECT order_id, order_date FROM orders WHERE customer_id = 42;
```

The plan changes from a **Seq Scan** to a **Bitmap Index Scan** plus a **Bitmap Heap Scan**: find the matching entries in the index, then fetch those rows from the table. The estimated cost drops by more than 80%.

## What a B-tree can do

Because it's **sorted**, a B-tree index on `x` helps with:

- equality: `x = 5`, `x IN (1, 2, 3)`
- ranges: `x > 5`, `x BETWEEN 1 AND 9`, `x LIKE 'abc%'` (prefix only; the C collation used here allows this)
- sorting: `ORDER BY x` (forwards or backwards), especially with `LIMIT`
- `min(x)` / `max(x)`, and joins on `x`

```sql
CREATE INDEX order_items_unit_price_idx ON order_items (unit_price);
EXPLAIN SELECT order_id, unit_price FROM order_items ORDER BY unit_price DESC LIMIT 5;
```

Without the index, that query sorts 125,000 rows to find the top five. With it, PostgreSQL reads the last five index entries and stops.

## The price of an index

Indexes aren't free:

- every `INSERT`, `UPDATE` (of an indexed column) and `DELETE` has to maintain every index;
- they take disk space and memory;
- the planner has more options to consider.

So index what your queries actually filter, join and sort on. Don't index every column "just in case". `pg_stat_user_indexes.idx_scan` tells you which indexes are never used (Module 16).

## EXPLAIN ANALYZE

`EXPLAIN` shows the plan with **estimates**. `EXPLAIN ANALYZE` actually **runs** the query and adds real timings and row counts:

```sql
EXPLAIN ANALYZE SELECT count(*) FROM orders WHERE order_date >= '2025-06-01';
```

Compare `rows=` (estimated) with `actual ... rows=` on each node. A large mismatch means the planner is working from bad statistics and may have picked a bad plan. Timings in this browser-based database are slower and noisier than on a real server, which is why grading uses the deterministic cost estimate instead.

> **Dialect note.** B-tree is the default index type in every major database. SQL Server's *clustered* index stores the table itself in key order (one per table). InnoDB (MySQL) always clusters by primary key. PostgreSQL tables are heaps, and `CLUSTER` reorders one once, without keeping it ordered.
