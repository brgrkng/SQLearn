---
title: "WITH: naming the steps"
kind: lesson
---
"Customers who placed more orders than the average customer" takes two steps: count orders per customer, then compare each count with the average count. As nested subqueries:

```sql
SELECT customer_id, n
FROM (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id) per_customer
WHERE n > (SELECT avg(n) FROM (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id) again)
ORDER BY n DESC
LIMIT 5;
```

The same thing with a CTE. The step is written once, named, and then used twice:

```sql
WITH per_customer AS (
  SELECT customer_id, count(*) AS n
  FROM orders
  GROUP BY customer_id
)
SELECT customer_id, n
FROM per_customer
WHERE n > (SELECT avg(n) FROM per_customer)
ORDER BY n DESC
LIMIT 5;
```

## Chaining steps

Separate several CTEs with commas. Each one can use the ones defined before it:

```sql
WITH monthly AS (
  SELECT date_trunc('month', o.order_date)::date AS month,
         sum(oi.quantity * oi.unit_price) AS revenue
  FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.order_date >= '2025-01-01'
  GROUP BY 1
),
average AS (
  SELECT avg(revenue) AS avg_revenue FROM monthly
)
SELECT m.month, m.revenue, round(m.revenue - a.avg_revenue, 2) AS vs_average
FROM monthly m CROSS JOIN average a
ORDER BY m.month;
```

Read it top to bottom: monthly revenue, then the average month, then each month compared with the average. When a query gets complicated, writing it as a chain of small CTEs that you can test one at a time is the most reliable way to get it right.

## Are CTEs slower?

Since PostgreSQL 12, a CTE that is referenced **once** (and has no side effects) is inlined into the main query, so the planner optimises it exactly as if you'd written a subquery. A CTE referenced **more than once** is computed once and reused (*materialized*). You can override this choice:

```sql
EXPLAIN
WITH big AS MATERIALIZED (SELECT * FROM orders WHERE order_date >= '2025-12-01')
SELECT count(*) FROM big WHERE status = 'pending';
```

`MATERIALIZED` forces the CTE to be computed separately, which acts as an "optimisation fence". `NOT MATERIALIZED` forces inlining. You rarely need either. They're mostly useful when the planner's choice turns out badly.

> **Dialect note.** CTEs are standard SQL and supported by every major database (MySQL from 8.0). Before PostgreSQL 12, CTEs were *always* materialized, so older advice calls them optimisation fences. That's no longer true by default. SQL Server never materializes them.
