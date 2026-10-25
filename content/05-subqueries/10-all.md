---
title: Pricier than every phone
kind: drill
ordered: true
hints:
  - "`price > ALL (SELECT price FROM products WHERE category_id = 9)`"
---
Return the `name` and `price` of products that cost **more than every product in category 9** (*Phones*), cheapest first, ties broken by name.

```sql solution
SELECT name, price
FROM products
WHERE price > ALL (SELECT price FROM products WHERE category_id = 9)
ORDER BY price, name;
```

```sql wrong
SELECT name, price
FROM products
WHERE price > ANY (SELECT price FROM products WHERE category_id = 9)
ORDER BY price, name;
```
