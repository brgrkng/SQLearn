---
title: Revenue by top-level category
kind: test
ordered: true
---
Each category belongs to exactly one **top-level** category (one with no parent), possibly through several levels. Return each top-level category's `name` and the total revenue (`quantity × unit_price`, all order lines) of every product beneath it. Highest revenue first.

```sql solution
WITH RECURSIVE roots AS (
  SELECT category_id, category_id AS root_id FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.category_id, r.root_id FROM categories c JOIN roots r ON c.parent_id = r.category_id
)
SELECT top.name, sum(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p    ON p.product_id = oi.product_id
JOIN roots r       ON r.category_id = p.category_id
JOIN categories top ON top.category_id = r.root_id
GROUP BY top.name
ORDER BY revenue DESC;
```

```sql wrong
SELECT coalesce(parent.name, c.name) AS name, sum(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p ON p.product_id = oi.product_id
JOIN categories c ON c.category_id = p.category_id
LEFT JOIN categories parent ON parent.category_id = c.parent_id
GROUP BY 1
ORDER BY revenue DESC;
```
