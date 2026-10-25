---
title: Stock cover
kind: drill
hints:
  - "Dividing by `nullif(stock, 0)` gives NULL instead of an error when stock is zero."
---
For products in category **17** (*Fitness*), return `name`, `stock`, and **price ÷ stock** rounded to 2 decimals, a rough "value of each unit on the shelf". Products with zero stock should show NULL for that column instead of causing an error.

```sql starter
SELECT name, stock, round(price / stock, 2) AS value_per_unit
FROM products
WHERE category_id = 17;
```

```sql solution
SELECT name, stock, round(price / nullif(stock, 0), 2) AS value_per_unit
FROM products
WHERE category_id = 17;
```

```sql wrong
SELECT name, stock, round(price / nullif(stock, 0)) AS value_per_unit
FROM products
WHERE category_id = 17;
```
