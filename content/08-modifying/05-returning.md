---
title: Insert and report back
kind: drill
hints:
  - "End the INSERT with `RETURNING product_id, name, discontinued`."
---
Add product **1001**: `Nova Smart Speaker` in category **7**, priced **79.99**, with **40** in stock, added on **2026-01-15**. Leave `discontinued` to its default. In the same statement, return the new row's `product_id`, `name` and `discontinued` values.

```sql solution
INSERT INTO products (product_id, name, category_id, price, stock, added_on)
VALUES (1001, 'Nova Smart Speaker', 7, 79.99, 40, '2026-01-15')
RETURNING product_id, name, discontinued;
```

```sql wrong
INSERT INTO products (product_id, name, category_id, price, stock, added_on, discontinued)
VALUES (1001, 'Nova Smart Speaker', 7, 79.99, 40, '2026-01-15', true)
RETURNING product_id, name, discontinued;
```
