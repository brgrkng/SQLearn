---
title: Line items from JSON
kind: drill
dataset: empty
hints:
  - "`FROM carts c, jsonb_array_elements(c.doc -> 'items') AS item`"
---
Each cart stores its items as a JSON array. Return one row per item: `cart_id`, the item's `sku`, and its `qty` as an integer.

```sql setup
CREATE TABLE carts (cart_id int PRIMARY KEY, doc jsonb NOT NULL);
INSERT INTO carts VALUES
  (1, '{"items": [{"sku": "PEN", "qty": 2}, {"sku": "INK", "qty": 1}]}'),
  (2, '{"items": [{"sku": "PAD", "qty": 5}]}'),
  (3, '{"items": []}');
```

```sql solution
SELECT c.cart_id, item ->> 'sku' AS sku, (item ->> 'qty')::int AS qty
FROM carts c, jsonb_array_elements(c.doc -> 'items') AS item;
```

```sql wrong
SELECT cart_id, doc #>> '{items,0,sku}' AS sku, (doc #>> '{items,0,qty}')::int AS qty FROM carts;
```
