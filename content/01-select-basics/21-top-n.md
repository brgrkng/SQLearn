---
title: Five most expensive
kind: drill
ordered: true
hints:
  - Sort by price, highest first, then take five rows.
  - Two products can share a price. Add a second sort key.
---
Return the `name` and `price` of the **five most expensive products**, most expensive first. Break any ties by `name`, alphabetically.

```sql starter
SELECT name, price
FROM products
```

```sql solution
SELECT name, price FROM products ORDER BY price DESC, name LIMIT 5;
```

```sql wrong
SELECT name, price FROM products ORDER BY price LIMIT 5;
```
