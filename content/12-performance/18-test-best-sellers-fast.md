---
title: Units for a handful of products
kind: test
costSlack: 10
---
Make this query answerable with an **index-only scan**:

```sql norun
SELECT product_id, sum(quantity) FROM order_items WHERE product_id IN (5, 77, 301) GROUP BY product_id;
```

```sql solution
CREATE INDEX order_items_product_qty_idx ON order_items (product_id) INCLUDE (quantity);
```

```sql explain
SELECT product_id, sum(quantity) FROM order_items WHERE product_id IN (5, 77, 301) GROUP BY product_id;
```

```sql wrong
CREATE INDEX order_items_product_idx ON order_items (product_id);
```
