---
title: Dropped from the basket
kind: drill
ordered: true
hints:
  - "Products ordered in January 2025, `EXCEPT` products ordered in December 2025."
---
Return the `product_id` of products that were ordered in **January 2025** but **not in the first week of December 2025** (1–7 December), sorted.

```sql solution
SELECT oi.product_id FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
WHERE o.order_date >= '2025-01-01' AND o.order_date < '2025-02-01'
EXCEPT
SELECT oi.product_id FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
WHERE o.order_date >= '2025-12-01' AND o.order_date < '2025-12-08'
ORDER BY product_id;
```

```sql wrong
SELECT oi.product_id FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
WHERE o.order_date >= '2025-12-01' AND o.order_date < '2025-12-08'
EXCEPT
SELECT oi.product_id FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
WHERE o.order_date >= '2025-01-01' AND o.order_date < '2025-02-01'
ORDER BY product_id;
```
