---
title: Year-over-year growth
kind: problem
difficulty: medium
ordered: true
hints:
  - Monthly revenue for 2024 and 2025 in one CTE, ordered by month.
  - "`lag(revenue, 12)` reaches the same month last year, if every month is present."
---
For each month of **2025** (first day, as a `date`), return the revenue (`quantity × unit_price` of that month's orders), the revenue in the **same month of 2024**, and the **year-over-year growth** as a percentage rounded to 1 decimal place. In month order.

```sql solution
WITH monthly AS (
  SELECT date_trunc('month', o.order_date)::date AS month, sum(oi.quantity * oi.unit_price) AS revenue
  FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.order_date >= '2024-01-01' AND o.order_date < '2026-01-01'
  GROUP BY 1
), compared AS (
  SELECT month, revenue, lag(revenue, 12) OVER (ORDER BY month) AS last_year FROM monthly
)
SELECT month, revenue, last_year, round(100 * (revenue - last_year) / last_year, 1) AS yoy_pct
FROM compared
WHERE month >= '2025-01-01'
ORDER BY month;
```

```sql wrong
WITH monthly AS (
  SELECT date_trunc('month', o.order_date)::date AS month, sum(oi.quantity * oi.unit_price) AS revenue
  FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.order_date >= '2024-01-01' AND o.order_date < '2026-01-01'
  GROUP BY 1
), compared AS (
  SELECT month, revenue, lag(revenue) OVER (ORDER BY month) AS last_year FROM monthly
)
SELECT month, revenue, last_year, round(100 * (revenue - last_year) / last_year, 1) AS yoy_pct
FROM compared
WHERE month >= '2025-01-01'
ORDER BY month;
```
