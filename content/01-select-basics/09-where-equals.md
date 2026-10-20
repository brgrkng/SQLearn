---
title: The computers aisle
kind: drill
hints:
  - "`WHERE category_id = 8`"
---
Category **8** is *Computers*. Return the `name` and `price` of every product in that category.

```sql starter
SELECT name, price
FROM products;
```

```sql solution
SELECT name, price FROM products WHERE category_id = 8;
```
