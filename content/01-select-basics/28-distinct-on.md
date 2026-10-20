---
title: Cheapest in each category
kind: drill
ordered: true
hints:
  - "`DISTINCT ON (category_id)` keeps the first row per category."
  - "`ORDER BY` decides which row is first, and has to start with `category_id`."
---
For each category, return the **cheapest product**: `category_id`, `name` and `price`. If two products tie on price, take the one whose name comes first alphabetically. Sort the output by `category_id`.

```sql starter
SELECT category_id, name, price
FROM products
ORDER BY category_id, price;
```

```sql solution
SELECT DISTINCT ON (category_id) category_id, name, price
FROM products
ORDER BY category_id, price, name;
```

```sql wrong
SELECT DISTINCT ON (category_id) category_id, name, price
FROM products
ORDER BY category_id, price DESC, name;
```
