---
title: Never touch the table
kind: drill
costSlack: 10
hints:
  - "The query only needs `product_id` and `quantity`. Put both in the index: `(product_id) INCLUDE (quantity)`."
---
Make this per-product sales total answerable from the index alone (an **index-only scan**):

```sql norun
SELECT sum(quantity) FROM order_items WHERE product_id = 77;
```

```sql solution
CREATE INDEX order_items_product_qty_idx ON order_items (product_id) INCLUDE (quantity);
```

```sql explain
SELECT sum(quantity) FROM order_items WHERE product_id = 77;
```

```sql wrong
CREATE INDEX order_items_product_idx ON order_items (product_id);
```
