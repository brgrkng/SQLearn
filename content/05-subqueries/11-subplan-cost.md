---
title: Count without a subquery per row
kind: drill
ordered: true
hints:
  - The correlated subquery in SELECT scans `orders` once per customer.
  - LEFT JOIN orders and GROUP BY customer instead.
---
This report lists every customer in **Australia** with their number of orders. It's correct, but it runs the subquery once per customer, and each run scans all 50,000 orders. Rewrite it so it reads `orders` only once.

```sql starter
SELECT c.customer_id,
       (SELECT count(*) FROM orders o WHERE o.customer_id = c.customer_id) AS orders
FROM customers c
WHERE c.country = 'Australia'
ORDER BY c.customer_id;
```

```sql solution
SELECT c.customer_id, count(o.order_id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE c.country = 'Australia'
GROUP BY c.customer_id
ORDER BY c.customer_id;
```

```sql wrong
SELECT c.customer_id, count(o.order_id) AS orders
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
WHERE c.country = 'Australia'
GROUP BY c.customer_id
ORDER BY c.customer_id;
```
