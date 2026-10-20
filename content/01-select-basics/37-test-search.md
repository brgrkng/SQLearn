---
title: Search results
kind: test
ordered: true
---
A shopper searches for **book**. Return the `name` and `price` of every product that is **not discontinued** and whose name contains *book* **in any capitalisation**. Cheapest first, ties broken by name.

```sql solution
SELECT name, price
FROM products
WHERE name ILIKE '%book%' AND NOT discontinued
ORDER BY price, name;
```

```sql wrong
SELECT name, price
FROM products
WHERE name LIKE '%book%' AND NOT discontinued
ORDER BY price, name;
```

```sql wrong
SELECT name, price
FROM products
WHERE name ILIKE '%book%'
ORDER BY price, name;
```
