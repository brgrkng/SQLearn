---
title: Boxes of twelve
kind: drill
hints:
  - "`stock` is an integer, so `stock / 12` already drops the remainder."
  - "`%` gives the remainder."
---
The warehouse ships products in boxes of 12. For every product, return:

1. `name`
2. `stock`
3. how many **full** boxes the stock fills
4. how many units are **left over** after filling those boxes

```sql starter
SELECT name, stock
FROM products;
```

```sql solution
SELECT name, stock, stock / 12 AS full_boxes, stock % 12 AS loose_units FROM products;
```

```sql wrong
SELECT name, stock, stock / 12.0, stock % 12 FROM products;
```

## Explanation
Integer division (`int / int`) truncates toward zero, so `212 / 12` is `17` and `212 % 12` is `8`. This is exactly what you want here. The same behaviour is a common source of bugs elsewhere: a ratio such as `wins / games` silently returns `0` when both columns are integers.
