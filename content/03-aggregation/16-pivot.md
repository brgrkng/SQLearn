---
title: Status pivot
kind: drill
ordered: true
hints:
  - One `count(*) FILTER (WHERE status = ...)` per column.
---
Build a pivot of **2025** orders by month: one row per month (`1` to `12`, from `extract(month ...)`), with columns for the number of **delivered**, **cancelled** and **returned** orders, in that order.

```sql solution
SELECT extract(month FROM order_date) AS month,
       count(*) FILTER (WHERE status = 'delivered') AS delivered,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       count(*) FILTER (WHERE status = 'returned')  AS returned
FROM orders
WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'
GROUP BY month
ORDER BY month;
```

```sql wrong
SELECT extract(month FROM order_date) AS month,
       count(*) FILTER (WHERE status = 'delivered') AS delivered,
       count(*) FILTER (WHERE status = 'returned')  AS returned,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM orders
WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'
GROUP BY month
ORDER BY month;
```
