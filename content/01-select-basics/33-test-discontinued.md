---
title: Discontinued but still in stock
kind: test
ordered: true
---
The shop wants to clear out discontinued products that still have units on the shelf. Return the `product_id`, `name` and `stock` of every **discontinued** product with **stock above zero**, largest stock first, ties broken by `product_id`.

```sql solution
SELECT product_id, name, stock
FROM products
WHERE discontinued AND stock > 0
ORDER BY stock DESC, product_id;
```

```sql wrong
SELECT product_id, name, stock
FROM products
WHERE discontinued AND stock > 0
ORDER BY stock, product_id;
```

```sql wrong
SELECT product_id, name, stock
FROM products
WHERE discontinued OR stock > 0
ORDER BY stock DESC, product_id;
```
