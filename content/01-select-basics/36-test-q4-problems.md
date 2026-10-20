---
title: Problem orders in Q4 2024
kind: test
---
Return the `order_id`, `order_date` and `status` of every order that was **cancelled or returned** and was placed in the **fourth quarter of 2024** (October through December).

```sql solution
SELECT order_id, order_date, status
FROM orders
WHERE status IN ('cancelled', 'returned')
  AND order_date >= '2024-10-01' AND order_date < '2025-01-01';
```

```sql wrong
SELECT order_id, order_date, status
FROM orders
WHERE status = 'cancelled' OR status = 'returned'
  AND order_date >= '2024-10-01' AND order_date < '2025-01-01';
```

```sql wrong
SELECT order_id, order_date, status
FROM orders
WHERE status IN ('cancelled', 'returned')
  AND order_date >= '2024-10-01' AND order_date < '2024-12-31';
```
