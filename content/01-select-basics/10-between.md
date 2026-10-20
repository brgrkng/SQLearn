---
title: Mid-range products
kind: drill
hints:
  - "`BETWEEN low AND high` includes both ends."
---
Return the `name` and `price` of every product priced from **$49.99 up to and including $99.99**.

```sql starter
SELECT name, price
FROM products
WHERE
```

```sql solution
SELECT name, price FROM products WHERE price BETWEEN 49.99 AND 99.99;
```

```sql wrong
SELECT name, price FROM products WHERE price > 49.99 AND price < 99.99;
```
