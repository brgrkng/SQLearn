---
title: Partial dependency (2NF)
kind: drill
dataset: empty
hints:
  - "`product_name` depends on `sku` alone, not on the whole key `(order_id, sku)`."
  - Create `products` first, fill it with `SELECT DISTINCT sku, product_name`, then create `order_lines` with a foreign key to it.
---
In `order_lines_raw` the key is `(order_id, sku)`, but `product_name` depends on `sku` alone, so it repeats. Normalize into:

- `products(sku, product_name)`, keyed by `sku`
- `order_lines(order_id, sku, qty)`, keyed by `(order_id, sku)`, with `sku` referring to `products`

Fill both from `order_lines_raw`.

```sql setup
CREATE TABLE order_lines_raw (order_id int, sku text, qty int, product_name text);
INSERT INTO order_lines_raw VALUES
  (1, 'PEN', 1, 'Fountain pen'), (1, 'INK', 2, 'Ink bottle'), (2, 'PEN', 3, 'Fountain pen'),
  (3, 'PAD', 5, 'Notepad'), (3, 'INK', 1, 'Ink bottle');
```

```sql solution
CREATE TABLE products (sku text PRIMARY KEY, product_name text NOT NULL);
INSERT INTO products SELECT DISTINCT sku, product_name FROM order_lines_raw;
CREATE TABLE order_lines (order_id int, sku text REFERENCES products, qty int NOT NULL, PRIMARY KEY (order_id, sku));
INSERT INTO order_lines SELECT order_id, sku, qty FROM order_lines_raw;
```

```sql check Each product appears once
SELECT sku, product_name FROM products;
```

```sql check Order lines
SELECT order_id, sku, qty FROM order_lines;
```

```sql check Lines must reference real products
INSERT INTO order_lines VALUES (4, 'NOPE', 1);
```

```sql check Renaming a product is a single-row update
UPDATE products SET product_name = 'Ink (50ml)' WHERE sku = 'INK';
SELECT count(*) FROM products WHERE product_name = 'Ink (50ml)';
```

```sql wrong
CREATE TABLE products (sku text, product_name text NOT NULL);
INSERT INTO products SELECT sku, product_name FROM order_lines_raw;
CREATE TABLE order_lines (order_id int, sku text, qty int NOT NULL, PRIMARY KEY (order_id, sku));
INSERT INTO order_lines SELECT order_id, sku, qty FROM order_lines_raw;
```
