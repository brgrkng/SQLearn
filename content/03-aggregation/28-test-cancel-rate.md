---
title: Cancellation rate by month
kind: test
ordered: true
---
For each month of **2024** (as the first day of the month, a `date`), return the number of orders and the **percentage that were cancelled**, rounded to 1 decimal place, in month order.

```sql solution
SELECT date_trunc('month', order_date)::date AS month,
       count(*) AS orders,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancelled_pct
FROM orders
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'
GROUP BY month
ORDER BY month;
```

```sql wrong
SELECT date_trunc('month', order_date)::date AS month,
       count(*) AS orders,
       round(100 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancelled_pct
FROM orders
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'
GROUP BY month
ORDER BY month;
```
