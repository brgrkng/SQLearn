---
title: Who placed these orders?
kind: drill
hints:
  - "`JOIN customers c ON c.customer_id = o.customer_id`"
---
For orders placed on **2025-06-01**, return `order_id`, and the customer's `first_name` and `last_name`.

```sql starter
SELECT order_id, customer_id
FROM orders
WHERE order_date = '2025-06-01';
```

```sql solution
SELECT o.order_id, c.first_name, c.last_name
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE o.order_date = '2025-06-01';
```

```sql wrong
SELECT o.order_id, c.first_name, c.last_name
FROM orders o
JOIN customers c ON c.customer_id = o.order_id
WHERE o.order_date = '2025-06-01';
```
