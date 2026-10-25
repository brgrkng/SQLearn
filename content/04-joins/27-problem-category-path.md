---
title: Category breadcrumbs
kind: problem
difficulty: medium
ordered: true
hints:
  - The category tree is at most three levels deep, so two self-joins reach the top.
  - "Use LEFT JOINs so shallow categories aren't lost, and `concat_ws(' > ', ...)` to skip the NULLs."
---
The site shows breadcrumbs like `Electronics > Audio > Headphones`. For every **product** in category **25** or **26**, return `product_id`, `name`, and the breadcrumb from the top-level category down to the product's own category. Sort by `product_id`.

```sql solution
SELECT p.product_id, p.name, concat_ws(' > ', c3.name, c2.name, c1.name) AS breadcrumb
FROM products p
JOIN categories c1      ON c1.category_id = p.category_id
LEFT JOIN categories c2 ON c2.category_id = c1.parent_id
LEFT JOIN categories c3 ON c3.category_id = c2.parent_id
WHERE p.category_id IN (25, 26)
ORDER BY p.product_id;
```

```sql wrong
SELECT p.product_id, p.name, concat_ws(' > ', c1.name, c2.name, c3.name) AS breadcrumb
FROM products p
JOIN categories c1      ON c1.category_id = p.category_id
LEFT JOIN categories c2 ON c2.category_id = c1.parent_id
LEFT JOIN categories c3 ON c3.category_id = c2.parent_id
WHERE p.category_id IN (25, 26)
ORDER BY p.product_id;
```

```sql wrong
SELECT p.product_id, p.name, concat_ws(' > ', c2.name, c1.name) AS breadcrumb
FROM products p
JOIN categories c1      ON c1.category_id = p.category_id
LEFT JOIN categories c2 ON c2.category_id = c1.parent_id
WHERE p.category_id IN (25, 26)
ORDER BY p.product_id;
```
