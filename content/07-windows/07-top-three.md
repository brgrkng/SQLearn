---
title: Top three sellers per category
kind: drill
ordered: true
hints:
  - Aggregate units per product first, then rank within each category.
  - "`rank() <= 3` keeps ties at third place."
---
For categories **7** and **8**, return the **best-selling products** in each category by total units sold: `category_id`, product `name` and units. Keep the top 3 per category, **including any ties for third place**. Sort by `category_id`, units descending, then name.

```sql solution
WITH units AS (
  SELECT p.category_id, p.name, sum(oi.quantity) AS units
  FROM products p JOIN order_items oi ON oi.product_id = p.product_id
  WHERE p.category_id IN (7, 8)
  GROUP BY p.category_id, p.name
), ranked AS (
  SELECT *, rank() OVER (PARTITION BY category_id ORDER BY units DESC) AS r FROM units
)
SELECT category_id, name, units FROM ranked WHERE r <= 3 ORDER BY category_id, units DESC, name;
```

```sql wrong
SELECT p.category_id, p.name, sum(oi.quantity) AS units
FROM products p JOIN order_items oi ON oi.product_id = p.product_id
WHERE p.category_id IN (7, 8)
GROUP BY p.category_id, p.name
ORDER BY units DESC
LIMIT 6;
```
