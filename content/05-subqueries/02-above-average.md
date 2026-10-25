---
title: Above average
kind: drill
hints:
  - "`WHERE price > (SELECT avg(price) FROM products)`"
---
Return the `name` and `price` of every product priced **above the average price** of all products.

```sql starter
SELECT name, price
FROM products
WHERE price > avg(price);
```

```sql solution
SELECT name, price FROM products WHERE price > (SELECT avg(price) FROM products);
```

```sql wrong
SELECT name, price FROM products WHERE price > (SELECT avg(price) FROM products WHERE NOT discontinued) + 100;
```
