---
title: Delivery received
kind: test
---
A delivery of **60** units of product **5** arrived. Add them to its stock and return the product's `product_id` and new `stock`.

```sql solution
UPDATE products SET stock = stock + 60 WHERE product_id = 5 RETURNING product_id, stock;
```

```sql wrong
UPDATE products SET stock = 60 WHERE product_id = 5 RETURNING product_id, stock;
```
