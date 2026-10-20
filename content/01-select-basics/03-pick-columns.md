---
title: Name and price
kind: drill
hints:
  - List the columns after `SELECT`, separated by commas, in the order you want them.
---
List every product's **name** and **price**, in that order.

```sql starter
SELECT
FROM products;
```

```sql solution
SELECT name, price FROM products;
```

```sql wrong
SELECT price, name FROM products;
```
