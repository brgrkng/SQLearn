---
title: One brand
kind: drill
hints:
  - Product names start with the brand, then a space.
  - "`%` matches any run of characters."
---
Return the `name` and `price` of every product from the **Zenith** brand.

```sql starter
SELECT name, price
FROM products
WHERE name LIKE
```

```sql solution
SELECT name, price FROM products WHERE name LIKE 'Zenith %';
```

```sql wrong
SELECT name, price FROM products WHERE name LIKE 'Zenith';
```
