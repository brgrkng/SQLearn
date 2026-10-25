---
title: Latest order per customer
kind: test
ordered: true
---
For customers **100 to 110**, return `customer_id` and the `order_id` and `order_date` of their **most recent order** (ties on date broken by the higher `order_id`). Customers with no orders are not listed. Sort by `customer_id`.

```sql solution
SELECT c.customer_id, latest.order_id, latest.order_date
FROM customers c
CROSS JOIN LATERAL (
  SELECT o.order_id, o.order_date FROM orders o
  WHERE o.customer_id = c.customer_id
  ORDER BY o.order_date DESC, o.order_id DESC
  LIMIT 1
) latest
WHERE c.customer_id BETWEEN 100 AND 110
ORDER BY c.customer_id;
```

```sql wrong
SELECT c.customer_id, latest.order_id, latest.order_date
FROM customers c
CROSS JOIN LATERAL (
  SELECT o.order_id, o.order_date FROM orders o
  WHERE o.customer_id = c.customer_id
  ORDER BY o.order_date, o.order_id
  LIMIT 1
) latest
WHERE c.customer_id BETWEEN 100 AND 110
ORDER BY c.customer_id;
```
