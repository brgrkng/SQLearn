---
title: Subtotals with ROLLUP and CUBE
kind: lesson
---
Reports often need subtotals and a grand total alongside the detail rows. `GROUP BY ROLLUP (a, b)` produces groups for `(a, b)`, then `(a)` on its own, then the grand total `()`:

```sql
SELECT extract(year FROM order_date) AS year, status, count(*) AS orders
FROM orders
WHERE status IN ('cancelled', 'returned')
GROUP BY ROLLUP (year, status)
ORDER BY year, status;
```

In subtotal rows, the rolled-up column is NULL. If a column can contain real NULLs too, use `grouping(col)` to tell them apart: it returns 1 when the column was rolled up:

```sql
SELECT CASE WHEN grouping(country) = 1 THEN 'All countries' ELSE country END AS country,
       CASE WHEN grouping(loyalty_tier) = 1 THEN 'All tiers' ELSE coalesce(loyalty_tier, 'none') END AS tier,
       count(*)
FROM customers
WHERE country IN ('Kenya', 'Nigeria')
GROUP BY ROLLUP (country, loyalty_tier)
ORDER BY grouping(country), country, grouping(loyalty_tier), tier;
```

- `CUBE (a, b)` produces **every** combination: `(a, b)`, `(a)`, `(b)` and `()`.
- `GROUPING SETS ((a), (b), ())` lists exactly the groupings you want.

```sql
SELECT status, extract(year FROM order_date) AS year, count(*)
FROM orders
GROUP BY GROUPING SETS ((status), (year), ())
ORDER BY status, year;
```

All of this happens in one pass over the data, which is cheaper and simpler than gluing several `GROUP BY` queries together with `UNION ALL`.

> **Dialect note.** SQL Server, Oracle and Db2 support ROLLUP, CUBE and GROUPING SETS. MySQL supports `GROUP BY a, b WITH ROLLUP` (and `GROUPING()` from 8.0), but not CUBE or GROUPING SETS.
