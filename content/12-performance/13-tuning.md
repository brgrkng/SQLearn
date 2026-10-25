---
title: A tuning workflow and common anti-patterns
kind: lesson
---
## The workflow

1. **Find the slow queries.** Don't guess. `pg_stat_statements` ranks queries by total time, and slow-query logs and APM tools show which ones hurt users.
2. **Get the real plan** with `EXPLAIN (ANALYZE, BUFFERS)`, ideally on production-sized data.
3. **Find the expensive node.** Look for a big seq scan, a sort spilling to disk, a nested loop running thousands of times, or estimates far from the actual rows.
4. **Change one thing**: an index, a rewrite, fresh statistics.
5. **Measure again.** Keep the change only if it helped, and check what it costs on writes.

## Anti-patterns

**Functions on indexed columns** (Module 1): `WHERE date_trunc('day', created_at) = ...` can't use an index on `created_at`. Use a range, or an expression index.

**Leading wildcards**: `LIKE '%term'` can't use a B-tree. Use a trigram GIN index, or full-text search (Module 15).

**N+1 queries**: the application fetches 50 orders, then runs one query per order for its lines, which is 51 round trips. One query with a join, or `WHERE order_id = ANY($1)`, does the same work in a single round trip.

**`SELECT *` everywhere**: it ships columns nobody reads, and it rules out index-only scans.

**OR across different columns** can sometimes defeat indexes. PostgreSQL usually manages a `BitmapOr` when each column has an index:

```sql
CREATE INDEX orders_customer_idx ON orders (customer_id);
EXPLAIN SELECT order_id FROM orders WHERE customer_id = 42 OR order_date = '2025-06-01';
```

**Deep OFFSET pagination**: use keyset pagination (Module 1).

**`count(*)` of a huge table on every page view**: an exact count has to visit every row. Show an estimate (`reltuples` in `pg_class`), or maintain a counter.

**Correlated subqueries in SELECT** over large outer sets (Module 5): rewrite them as a join with `GROUP BY`.

## Partitioning, briefly

Very large tables, typically time series with billions of rows, can be **partitioned**: split into child tables by a key such as month, behind one parent table:

```sql
CREATE TABLE measurements (taken_at timestamptz NOT NULL, sensor int NOT NULL, value float8)
PARTITION BY RANGE (taken_at);
CREATE TABLE measurements_2026_01 PARTITION OF measurements FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE measurements_2026_02 PARTITION OF measurements FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
INSERT INTO measurements VALUES ('2026-01-15', 1, 20.5), ('2026-02-03', 1, 21.0);
EXPLAIN SELECT * FROM measurements WHERE taken_at >= '2026-02-01';
```

The plan only touches `measurements_2026_02`. This is **partition pruning**. Dropping an old month becomes an instant `DROP TABLE` instead of a huge `DELETE`. Partitioning is an operational tool for very large tables, not a fix for a missing index.

> **Dialect note.** The workflow is universal. The tools differ: Query Store and DMVs in SQL Server, `performance_schema` and the slow log in MySQL, AWR and ASH in Oracle. All of them support range partitioning, with different syntax.
