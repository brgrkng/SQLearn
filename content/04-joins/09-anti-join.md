---
title: Customers who never ordered
kind: drill
ordered: true
hints:
  - "LEFT JOIN orders, then keep rows where `o.order_id IS NULL`."
---
Return the `customer_id`, `first_name` and `last_name` of customers who have **never placed an order**, sorted by `customer_id`.

```sql starter
SELECT c.customer_id, c.first_name, c.last_name
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
ORDER BY c.customer_id;
```

```sql solution
SELECT c.customer_id, c.first_name, c.last_name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL
ORDER BY c.customer_id;
```
