---
title: Pricier than the category average
kind: drill
hints:
  - The subquery needs its own alias for `products` and must refer to the outer row's `category_id`.
---
Return the `name`, `category_id` and `price` of products priced **above the average price of their own category**.

```sql starter
SELECT name, category_id, price
FROM products
WHERE price > (SELECT avg(price) FROM products);
```

```sql solution
SELECT p.name, p.category_id, p.price
FROM products p
WHERE p.price > (SELECT avg(p2.price) FROM products p2 WHERE p2.category_id = p.category_id);
```
