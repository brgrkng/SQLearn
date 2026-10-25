---
title: Aggregate functions
kind: lesson
---
An aggregate function takes a set of rows and returns a single value:

```sql
SELECT count(*)            AS products,
       min(price)          AS cheapest,
       max(price)          AS dearest,
       round(avg(price), 2) AS average,
       sum(stock)          AS units_in_stock
FROM products;
```

With no `GROUP BY`, the whole table is one group and you get exactly one row back.

## Three ways to count

```sql
SELECT count(*)                 AS customers,
       count(email)             AS with_email,
       count(DISTINCT country)  AS countries,
       count(DISTINCT city)     AS cities
FROM customers;
```

- `count(*)` counts **rows**.
- `count(expr)` counts rows where `expr` is **not NULL**.
- `count(DISTINCT expr)` counts distinct non-NULL values.

## Aggregates ignore NULL

Every aggregate except `count(*)` skips NULLs. That is usually what you want, but it can surprise you:

```sql
SELECT avg(days) AS avg_ignoring_nulls,
       avg(coalesce(days, 0)) AS avg_nulls_as_zero,
       count(*) AS rows, count(days) AS non_null
FROM (VALUES (2), (4), (NULL)) AS t(days);
```

The first average is 3 (two values), and the second is 2 (three values). Decide which one your question means.

## Empty input

Aggregating zero rows still returns one row. `count` gives 0, but `sum`, `avg`, `min` and `max` give **NULL**:

```sql
SELECT count(*) AS n, sum(price) AS total, coalesce(sum(price), 0) AS total_or_zero
FROM products
WHERE price < 0;
```

Wrap sums in `coalesce(..., 0)` when a report must show 0 instead of an empty cell.

## Result types

`count` returns `bigint`. `sum` of integers returns `bigint`, and `avg` of integers returns `numeric`, so no integer-division surprise here. `avg` of `numeric` keeps many decimal places, so round it for display.

> **Dialect note.** These five aggregates are standard and behave the same everywhere, apart from result types: SQL Server's `AVG` of an `int` column returns an `int` (truncated!), so you'll see `AVG(x * 1.0)` in SQL Server code. SQL Server's `COUNT` also returns `int`; use `COUNT_BIG` on very large tables.
