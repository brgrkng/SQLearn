---
title: Running revenue
kind: drill
ordered: true
hints:
  - Daily revenue in a CTE, then `sum(revenue) OVER (ORDER BY day)`.
---
For **1–14 February 2025**, return each `order_date`, that day's revenue (`quantity × unit_price` over its orders' lines), and the **running total** of revenue since 1 February. In date order.

```sql solution
WITH daily AS (
  SELECT o.order_date, sum(oi.quantity * oi.unit_price) AS revenue
  FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.order_date >= '2025-02-01' AND o.order_date < '2025-02-15'
  GROUP BY o.order_date
)
SELECT order_date, revenue, sum(revenue) OVER (ORDER BY order_date) AS running_total
FROM daily
ORDER BY order_date;
```

```sql wrong
WITH daily AS (
  SELECT o.order_date, sum(oi.quantity * oi.unit_price) AS revenue
  FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.order_date >= '2025-02-01' AND o.order_date < '2025-02-15'
  GROUP BY o.order_date
)
SELECT order_date, revenue, sum(revenue) OVER () AS running_total
FROM daily
ORDER BY order_date;
```
