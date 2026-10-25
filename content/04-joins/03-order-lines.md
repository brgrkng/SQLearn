---
title: What's in the box?
kind: drill
hints:
  - Join `order_items` to `products` on `product_id`.
---
For **order 4321**, return each product's `name`, the `quantity` ordered and the `unit_price` paid.

```sql starter
SELECT product_id, quantity, unit_price
FROM order_items
WHERE order_id = 4321;
```

```sql solution
SELECT p.name, oi.quantity, oi.unit_price
FROM order_items oi
JOIN products p ON p.product_id = oi.product_id
WHERE oi.order_id = 4321;
```

```sql wrong
SELECT p.name, oi.quantity, p.price
FROM order_items oi
JOIN products p ON p.product_id = oi.product_id
WHERE oi.order_id = 4321;
```
