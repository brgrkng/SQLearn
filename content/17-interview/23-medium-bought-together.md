---
title: Frequently bought together
kind: problem
difficulty: medium
ordered: true
hints:
  - "Self-join `order_items` on `order_id`, with `a.product_id < b.product_id` so each pair appears once."
---
Find the **5 product pairs** that appear together in the most orders. Return both `product_id`s (smaller first) and the number of orders containing both. Most orders first, ties broken by the first product id, then the second.

```sql solution
SELECT a.product_id AS product_a, b.product_id AS product_b, count(*) AS orders
FROM order_items a
JOIN order_items b ON b.order_id = a.order_id AND a.product_id < b.product_id
GROUP BY a.product_id, b.product_id
ORDER BY orders DESC, product_a, product_b
LIMIT 5;
```

```sql wrong
SELECT a.product_id AS product_a, b.product_id AS product_b, count(*) AS orders
FROM order_items a
JOIN order_items b ON b.order_id = a.order_id AND a.product_id <> b.product_id
GROUP BY a.product_id, b.product_id
ORDER BY orders DESC, product_a, product_b
LIMIT 5;
```
