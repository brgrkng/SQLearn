---
title: Line totals
kind: drill
hints:
  - "`order_items` has one row per product in an order."
---
For **order 1234**, return each line's `product_id`, `quantity`, `unit_price`, and the **line total** (quantity × unit price).

```sql starter
SELECT product_id, quantity, unit_price
FROM order_items
WHERE order_id = 1234;
```

```sql solution
SELECT product_id, quantity, unit_price, quantity * unit_price AS line_total
FROM order_items
WHERE order_id = 1234;
```
