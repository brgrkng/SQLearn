---
title: Display stock
kind: drill
hints:
  - "`least(stock, 50)` caps a number."
  - You'll need a CASE (or two expressions) to also produce the label.
---
The storefront shows stock levels capped at 50: anything above 50 is displayed as `50+`. For products in category **19** (*Cycling*), return `name`, `stock`, and the display text: the stock number as text, or `50+` when stock is above 50.

```sql starter
SELECT name, stock
FROM products
WHERE category_id = 19;
```

```sql solution
SELECT name, stock, CASE WHEN stock > 50 THEN '50+' ELSE stock::text END AS display
FROM products
WHERE category_id = 19;
```

```sql wrong
SELECT name, stock, least(stock, 50)::text AS display
FROM products
WHERE category_id = 19;
```
