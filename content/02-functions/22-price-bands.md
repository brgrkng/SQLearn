---
title: Price bands
kind: drill
hints:
  - Branches are checked in order. Put the smallest threshold first.
---
For products in category **12** (*Furniture*), return `name`, `price`, and a band:

- `budget` under $100
- `standard` from $100 up to (but not including) $250
- `luxury` from $250

```sql starter
SELECT name, price
FROM products
WHERE category_id = 12;
```

```sql solution
SELECT name, price,
       CASE WHEN price < 100 THEN 'budget' WHEN price < 250 THEN 'standard' ELSE 'luxury' END AS band
FROM products
WHERE category_id = 12;
```

```sql wrong
SELECT name, price,
       CASE WHEN price < 250 THEN 'standard' WHEN price < 100 THEN 'budget' ELSE 'luxury' END AS band
FROM products
WHERE category_id = 12;
```

```sql wrong
SELECT name, price,
       CASE WHEN price < 100 THEN 'budget' WHEN price < 250 THEN 'standard' END AS band
FROM products
WHERE category_id = 12;
```
