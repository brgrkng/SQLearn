---
title: Bought it again
kind: problem
difficulty: medium
ordered: true
hints:
  - Join orders to order lines and group by customer and product.
  - Count distinct orders, not lines.
---
For customers **1 to 5**, find the products each one has bought in **more than one order**. Return `customer_id`, the product `name` and the number of orders it appeared in. Sort by `customer_id`, then by number of orders (most first), then product name.

```sql solution
SELECT o.customer_id, p.name, count(DISTINCT o.order_id) AS orders
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN products p     ON p.product_id = oi.product_id
WHERE o.customer_id BETWEEN 1 AND 5
GROUP BY o.customer_id, p.name
HAVING count(DISTINCT o.order_id) > 1
ORDER BY o.customer_id, orders DESC, p.name;
```

```sql wrong
SELECT o.customer_id, p.name, sum(oi.quantity) AS orders
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN products p     ON p.product_id = oi.product_id
WHERE o.customer_id BETWEEN 1 AND 5
GROUP BY o.customer_id, p.name
HAVING sum(oi.quantity) > 1
ORDER BY o.customer_id, orders DESC, p.name;
```
