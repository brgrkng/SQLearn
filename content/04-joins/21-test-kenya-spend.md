---
title: Spend per Kenyan customer
kind: test
ordered: true
---
For **every** customer in **Kenya**, return `customer_id`, their number of orders, and their total spend across all order lines (`quantity × unit_price`). Customers with no orders show **0** for both. Sort by `customer_id`.

```sql solution
SELECT c.customer_id,
       count(DISTINCT o.order_id) AS orders,
       coalesce(sum(oi.quantity * oi.unit_price), 0) AS spend
FROM customers c
LEFT JOIN orders o       ON o.customer_id = c.customer_id
LEFT JOIN order_items oi ON oi.order_id = o.order_id
WHERE c.country = 'Kenya'
GROUP BY c.customer_id
ORDER BY c.customer_id;
```

```sql wrong
SELECT c.customer_id,
       count(o.order_id) AS orders,
       coalesce(sum(oi.quantity * oi.unit_price), 0) AS spend
FROM customers c
LEFT JOIN orders o       ON o.customer_id = c.customer_id
LEFT JOIN order_items oi ON oi.order_id = o.order_id
WHERE c.country = 'Kenya'
GROUP BY c.customer_id
ORDER BY c.customer_id;
```

```sql wrong
SELECT c.customer_id,
       count(DISTINCT o.order_id) AS orders,
       sum(oi.quantity * oi.unit_price) AS spend
FROM customers c
JOIN orders o       ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
WHERE c.country = 'Kenya'
GROUP BY c.customer_id
ORDER BY c.customer_id;
```
