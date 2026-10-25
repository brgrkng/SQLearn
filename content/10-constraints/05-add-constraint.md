---
title: Harden the shop
kind: drill
hints:
  - "`ALTER TABLE orders ADD CONSTRAINT ... CHECK (...)` and `ALTER TABLE products ADD CONSTRAINT ... UNIQUE (name)`."
  - A CHECK passes when its expression is NULL, so unshipped orders are fine.
---
Add two rules to the existing **shop** schema:

1. On `orders`: an order can't be shipped **before** it was placed (`shipped_date` must not be earlier than `order_date`).
2. On `products`: product **names must be unique**.

The existing data already satisfies both.

```sql solution
ALTER TABLE orders ADD CONSTRAINT shipped_after_order CHECK (shipped_date >= order_date);
ALTER TABLE products ADD CONSTRAINT products_name_unique UNIQUE (name);
```

```sql check Shipping before ordering is rejected
UPDATE orders SET shipped_date = order_date - 1 WHERE order_id = 1;
```

```sql check Same-day shipping is fine
UPDATE orders SET shipped_date = order_date WHERE order_id = 2 RETURNING order_id;
```

```sql check Duplicate product names are rejected
UPDATE products SET name = 'Acme Laptop' WHERE product_id = 1;
```

```sql wrong
ALTER TABLE orders ADD CONSTRAINT shipped_after_order CHECK (shipped_date > order_date);
ALTER TABLE products ADD CONSTRAINT products_name_unique UNIQUE (name);
```
