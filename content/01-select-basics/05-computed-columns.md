---
title: Price with VAT
kind: drill
columnNames: true
hints:
  - Multiply by `1.2` to add 20%.
  - "`round(value, 2)` rounds to two decimal places."
---
For every product, return its `name`, its `price`, and a column named **price_with_vat** holding the price plus 20% VAT, **rounded to 2 decimal places**.

```sql starter
SELECT name, price
FROM products;
```

```sql solution
SELECT name, price, round(price * 1.2, 2) AS price_with_vat FROM products;
```

```sql wrong
SELECT name, price, price * 1.2 AS price_with_vat FROM products;
```

```sql wrong
SELECT name, price, round(price * 1.2, 2) FROM products;
```
