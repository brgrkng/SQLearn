---
title: Three latest orders per customer
kind: drill
ordered: true
hints:
  - "`CROSS JOIN LATERAL (SELECT ... FROM orders o WHERE o.customer_id = c.customer_id ORDER BY ... LIMIT 3)`"
---
For customers **1 to 5**, return each customer's **three most recent orders**: `customer_id`, `order_id` and `order_date`. Sort by `customer_id`, then newest order first, breaking ties by `order_id` descending.

```sql solution
SELECT c.customer_id, recent.order_id, recent.order_date
FROM customers c
CROSS JOIN LATERAL (
  SELECT o.order_id, o.order_date
  FROM orders o
  WHERE o.customer_id = c.customer_id
  ORDER BY o.order_date DESC, o.order_id DESC
  LIMIT 3
) AS recent
WHERE c.customer_id <= 5
ORDER BY c.customer_id, recent.order_date DESC, recent.order_id DESC;
```

```sql wrong
SELECT customer_id, order_id, order_date
FROM orders
WHERE customer_id <= 5
ORDER BY customer_id, order_date DESC, order_id DESC
LIMIT 15;
```
