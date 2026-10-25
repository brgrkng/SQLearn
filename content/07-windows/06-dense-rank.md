---
title: Price positions
kind: drill
ordered: true
hints:
  - Several products share a price. Which ranking function gives them the same position *without gaps* afterwards?
---
For products in category **11** (*Kitchen*), return `name`, `price` and the product's **price position**: 1 for the most expensive price, with products sharing a price getting the same position, and **no gaps** in the numbering. Sort by position, then name.

```sql solution
SELECT name, price, dense_rank() OVER (ORDER BY price DESC) AS position
FROM products
WHERE category_id = 11
ORDER BY position, name;
```

```sql wrong
SELECT name, price, rank() OVER (ORDER BY price DESC) AS position
FROM products
WHERE category_id = 11
ORDER BY position, name;
```

```sql wrong
SELECT name, price, row_number() OVER (ORDER BY price DESC, name) AS position
FROM products
WHERE category_id = 11
ORDER BY position, name;
```
