---
title: Restock list
kind: problem
difficulty: easy
ordered: true
---
Purchasing needs a list of products that are **out of stock** and **still being sold** (not discontinued). Return `product_id`, `name` and `category_id`, sorted by `category_id`, then `name`.

```sql solution
SELECT product_id, name, category_id
FROM products
WHERE stock = 0 AND NOT discontinued
ORDER BY category_id, name;
```

```sql wrong
SELECT product_id, name, category_id
FROM products
WHERE stock = 0
ORDER BY category_id, name;
```
