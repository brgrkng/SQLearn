---
title: Orders and units
kind: drill
ordered: true
hints:
  - After joining `order_items`, `count(*)` counts lines, not orders.
---
For customers **1 to 10**, return `customer_id`, their number of **orders**, and the total **units** they bought (sum of `quantity`). Sort by `customer_id`. Every one of these customers has orders.

```sql starter
SELECT o.customer_id, count(*) AS orders, sum(oi.quantity) AS units
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.customer_id <= 10
GROUP BY o.customer_id
ORDER BY o.customer_id;
```

```sql solution
SELECT o.customer_id, count(DISTINCT o.order_id) AS orders, sum(oi.quantity) AS units
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.customer_id <= 10
GROUP BY o.customer_id
ORDER BY o.customer_id;
```
