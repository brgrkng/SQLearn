---
title: Month-over-month orders
kind: drill
ordered: true
hints:
  - Monthly counts in a CTE, then `lag(orders) OVER (ORDER BY month)`.
  - "Multiply by `100.0` before dividing."
---
For each month of **2025** (first day, as a `date`), return the number of orders, the previous month's count (NULL for January), and the **percentage change** from the previous month rounded to 1 decimal place. In month order.

```sql solution
WITH monthly AS (
  SELECT date_trunc('month', order_date)::date AS month, count(*) AS orders
  FROM orders
  WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'
  GROUP BY 1
)
SELECT month, orders,
       lag(orders) OVER (ORDER BY month) AS previous,
       round(100.0 * (orders - lag(orders) OVER (ORDER BY month)) / lag(orders) OVER (ORDER BY month), 1) AS change_pct
FROM monthly
ORDER BY month;
```

```sql wrong
WITH monthly AS (
  SELECT date_trunc('month', order_date)::date AS month, count(*) AS orders
  FROM orders
  WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'
  GROUP BY 1
)
SELECT month, orders,
       lead(orders) OVER (ORDER BY month) AS previous,
       round(100.0 * (orders - lead(orders) OVER (ORDER BY month)) / lead(orders) OVER (ORDER BY month), 1) AS change_pct
FROM monthly
ORDER BY month;
```
