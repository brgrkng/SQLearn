---
title: Active customers, month over month
kind: problem
difficulty: medium
ordered: true
---
A customer is **active** in a month if they placed at least one order in it. For each month of **2025** (first day, as a `date`), return the number of active customers and the change from the previous month (NULL for January 2025, which has no previous month in the output). In month order.

```sql solution
WITH monthly AS (
  SELECT date_trunc('month', order_date)::date AS month, count(DISTINCT customer_id) AS active
  FROM orders
  WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'
  GROUP BY 1
)
SELECT month, active, active - lag(active) OVER (ORDER BY month) AS change
FROM monthly
ORDER BY month;
```

```sql wrong
WITH monthly AS (
  SELECT date_trunc('month', order_date)::date AS month, count(*) AS active
  FROM orders
  WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'
  GROUP BY 1
)
SELECT month, active, active - lag(active) OVER (ORDER BY month) AS change
FROM monthly
ORDER BY month;
```
