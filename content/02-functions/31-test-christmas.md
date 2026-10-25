---
title: Christmas orders
kind: test
---
Return `order_id`, `customer_id` and `order_date` for orders placed on **Christmas Day 2023 or Christmas Day 2024**. The query must be efficient. Remember that `order_date` is indexed.

```sql solution
SELECT order_id, customer_id, order_date
FROM orders
WHERE order_date IN ('2023-12-25', '2024-12-25');
```

```sql wrong
SELECT order_id, customer_id, order_date
FROM orders
WHERE extract(month FROM order_date) = 12 AND extract(day FROM order_date) = 25
  AND extract(year FROM order_date) IN (2023, 2024);
```

```sql wrong
SELECT order_id, customer_id, order_date
FROM orders
WHERE to_char(order_date, 'MM-DD') = '12-25' AND order_date >= '2023-01-01' AND order_date < '2025-01-01';
```
