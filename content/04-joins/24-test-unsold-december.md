---
title: Unsold in early December
kind: test
ordered: true
---
Return the `product_id` and `name` of products that were **not ordered at all in the first week of December 2025** (1–7 December), sorted by `product_id`.

```sql solution
SELECT p.product_id, p.name
FROM products p
LEFT JOIN (
  SELECT DISTINCT oi.product_id
  FROM order_items oi
  JOIN orders o ON o.order_id = oi.order_id
  WHERE o.order_date >= '2025-12-01' AND o.order_date < '2025-12-08'
) sold ON sold.product_id = p.product_id
WHERE sold.product_id IS NULL
ORDER BY p.product_id;
```

```sql wrong
SELECT p.product_id, p.name
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.product_id
LEFT JOIN orders o ON o.order_id = oi.order_id
WHERE oi.product_id IS NULL AND o.order_date >= '2025-12-01' AND o.order_date < '2025-12-08'
ORDER BY p.product_id;
```
