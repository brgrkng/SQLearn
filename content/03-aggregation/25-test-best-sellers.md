---
title: Best sellers
kind: test
ordered: true
---
Return the `product_id` and total **units sold** (sum of `quantity` across all order lines) of the **10 best-selling products**, most units first, ties broken by `product_id`.

```sql solution
SELECT product_id, sum(quantity) AS units
FROM order_items
GROUP BY product_id
ORDER BY units DESC, product_id
LIMIT 10;
```

```sql wrong
SELECT product_id, count(*) AS units
FROM order_items
GROUP BY product_id
ORDER BY units DESC, product_id
LIMIT 10;
```
