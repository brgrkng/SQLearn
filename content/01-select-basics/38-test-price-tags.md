---
title: Price tags
kind: test
ordered: true
---
Print shelf tags for products in category **26** (*Laptops*). Return one column per product holding text like `Zenith Laptop: $1498.99`, most expensive first, ties broken by name.

```sql solution
SELECT name || ': $' || price AS tag
FROM products
WHERE category_id = 26
ORDER BY price DESC, name;
```

```sql wrong
SELECT name || ': ' || price AS tag
FROM products
WHERE category_id = 26
ORDER BY price DESC, name;
```

```sql wrong
SELECT name || ': $' || price AS tag
FROM products
WHERE category_id = 26
ORDER BY tag DESC;
```
