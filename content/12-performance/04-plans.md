---
title: Reading query plans
kind: lesson
---
A plan is a **tree of nodes**. Each node pulls rows from its children, does something with them, and passes rows up. Read it from the innermost (most indented) nodes outwards:

```sql
EXPLAIN
SELECT c.country, count(*) AS orders
FROM orders o JOIN customers c ON c.customer_id = o.customer_id
WHERE o.order_date >= '2025-12-01'
GROUP BY c.country
ORDER BY orders DESC;
```

Each node shows `(cost=startup..total rows=estimated_rows width=bytes_per_row)`:

- **startup cost** is the work done before the first row comes out. A sort has to read everything first, so its startup is high.
- **total cost** is the work to produce every row. A parent's cost includes its children's.
- **rows** is the planner's estimate, based on table statistics.

## The scan types

| Node | Meaning |
|---|---|
| **Seq Scan** | read the whole table. It's the best plan when you need a large fraction of the rows |
| **Index Scan** | walk the index, fetch each matching row from the table in index order |
| **Index Only Scan** | answer from the index alone, never touching the table (needs every column in the index) |
| **Bitmap Index Scan + Bitmap Heap Scan** | collect matching row locations from one or more indexes, then read the table pages in physical order. It's the middle ground for medium-sized result sets |

**Index Cond** is a condition the index navigated by. **Filter** is a condition checked row by row after fetching. A large table where all the work happens in **Filter** usually means the index isn't helping.

```sql
EXPLAIN SELECT order_id FROM orders WHERE order_date = '2025-06-01' AND status = 'delivered';
```

Here `order_date` is the index condition, and `status` is filtered afterwards.

## Why the planner sometimes ignores your index

- **Low selectivity.** If a condition matches a large share of the table, reading it all sequentially is cheaper than jumping around through an index:

```sql
EXPLAIN SELECT order_id FROM orders WHERE order_date >= '2022-06-01';
```

- **The column is wrapped** in a function or cast that the index doesn't store (Module 1's sargability lesson).
- **Type mismatches**, such as comparing an `int` column to a `numeric` parameter.
- **Stale statistics.** The planner thinks a table has 10 rows when it has 10 million. `ANALYZE table` refreshes the statistics. Autovacuum normally does this for you.

## Statistics

The planner's estimates come from `pg_stats`: the most common values, a histogram, and the number of distinct values for each column, all sampled by `ANALYZE`:

```sql
SELECT attname, n_distinct, most_common_vals
FROM pg_stats
WHERE tablename = 'orders' AND attname IN ('status', 'customer_id');
```

> **Dialect note.** Every major database has a plan viewer: `EXPLAIN ANALYZE` (MySQL 8, PostgreSQL), graphical execution plans in SQL Server Management Studio, and `DBMS_XPLAN` in Oracle. The node names differ (SQL Server says *Clustered Index Scan* and *Key Lookup*), but the concepts map one to one.
