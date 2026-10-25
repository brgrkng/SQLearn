---
title: Category product lists
kind: drill
ordered: true
hints:
  - "`string_agg(name, ', ' ORDER BY name)`"
---
For categories **13**, **16** and **24**, return `category_id` and a comma-separated list (`, ` between items) of their product names in alphabetical order. Sort by `category_id`.

```sql starter
SELECT category_id, name
FROM products
WHERE category_id IN (13, 16, 24);
```

```sql solution
SELECT category_id, string_agg(name, ', ' ORDER BY name) AS products
FROM products
WHERE category_id IN (13, 16, 24)
GROUP BY category_id
ORDER BY category_id;
```

```sql wrong
SELECT category_id, string_agg(name, ',' ORDER BY name) AS products
FROM products
WHERE category_id IN (13, 16, 24)
GROUP BY category_id
ORDER BY category_id;
```
