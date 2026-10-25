---
title: Basket lift
kind: problem
difficulty: hard
ordered: true
hints:
  - "support(A) = orders containing A ÷ all orders. support(A,B) = orders containing both ÷ all orders."
  - "lift = support(A,B) ÷ (support(A) × support(B)). Above 1 means bought together more often than chance."
---
For product pairs bought together in **at least 6 orders**, compute the **lift**:

lift(A, B) = P(A and B) ÷ (P(A) × P(B)), where each P is the fraction of all orders containing the product(s).

Return the **5 pairs with the highest lift**: both `product_id`s (smaller first), the number of orders with both, and the lift rounded to 2 decimals. Highest lift first, ties broken by the pair's ids.

```sql solution
WITH total AS (
  SELECT count(*)::numeric AS n FROM orders
), product_orders AS (
  SELECT product_id, count(DISTINCT order_id) AS orders FROM order_items GROUP BY product_id
), pairs AS (
  SELECT a.product_id AS pa, b.product_id AS pb, count(*) AS both_orders
  FROM order_items a JOIN order_items b ON b.order_id = a.order_id AND a.product_id < b.product_id
  GROUP BY a.product_id, b.product_id
  HAVING count(*) >= 6
)
SELECT p.pa, p.pb, p.both_orders,
       round((p.both_orders / t.n) / ((oa.orders / t.n) * (ob.orders / t.n)), 2) AS lift
FROM pairs p
CROSS JOIN total t
JOIN product_orders oa ON oa.product_id = p.pa
JOIN product_orders ob ON ob.product_id = p.pb
ORDER BY lift DESC, p.pa, p.pb
LIMIT 5;
```

```sql wrong
WITH pairs AS (
  SELECT a.product_id AS pa, b.product_id AS pb, count(*) AS both_orders
  FROM order_items a JOIN order_items b ON b.order_id = a.order_id AND a.product_id < b.product_id
  GROUP BY a.product_id, b.product_id
  HAVING count(*) >= 6
)
SELECT pa, pb, both_orders, round(both_orders::numeric, 2) AS lift
FROM pairs
ORDER BY lift DESC, pa, pb
LIMIT 5;
```
