---
title: Total revenue
kind: drill
hints:
  - Revenue for a line is `quantity * unit_price`. Sum it across all lines.
---
What is the **total revenue** across all order lines (`quantity × unit_price`), counting **every** order line regardless of order status? Return a single number.

```sql starter
SELECT sum(unit_price)
FROM order_items;
```

```sql solution
SELECT sum(quantity * unit_price) AS revenue FROM order_items;
```

```sql wrong
SELECT sum(quantity) * sum(unit_price) FROM order_items;
```
