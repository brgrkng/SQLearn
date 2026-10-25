---
title: Nest it for the API
kind: drill
hints:
  - "`jsonb_agg(jsonb_build_object('order_id', order_id, 'date', order_date) ORDER BY order_date)`"
---
An API needs each customer with their orders nested as JSON. For customers **1 to 3**, return `customer_id` and an `orders` column: a JSON array of objects with keys `order_id` and `status`, ordered by `order_id`.

```sql solution
SELECT customer_id,
       jsonb_agg(jsonb_build_object('order_id', order_id, 'status', status) ORDER BY order_id) AS orders
FROM orders
WHERE customer_id <= 3
GROUP BY customer_id;
```

```sql wrong
SELECT customer_id,
       jsonb_agg(jsonb_build_object('order_id', order_id, 'status', status) ORDER BY order_id DESC) AS orders
FROM orders
WHERE customer_id <= 3
GROUP BY customer_id;
```
