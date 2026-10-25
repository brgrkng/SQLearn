---
title: Normalize the spreadsheet
kind: test
dataset: empty
---
`orders_flat` is the spreadsheet-style table from the first lesson of this module. Normalize it into these four tables and fill them from `orders_flat`:

- `customers(email, name, city)`, keyed by `email`
- `products(sku, name, list_price)`, keyed by `sku` (use each product's `unit_price` as its list price; it's the same on every row)
- `orders(order_id, email, order_date)`, keyed by `order_id`, with `email` referring to `customers`
- `order_lines(order_id, sku, quantity, unit_price)`, keyed by `(order_id, sku)`, referring to `orders` and `products`

```sql setup
CREATE TABLE orders_flat (order_id int, order_date date, customer_email text, customer_name text, customer_city text,
                          product_sku text, product_name text, unit_price numeric(8,2), quantity int);
INSERT INTO orders_flat VALUES
  (1, '2026-01-03', 'ada@x.io',  'Ada Lovelace', 'London',   'PEN', 'Fountain pen', 25.00, 1),
  (1, '2026-01-03', 'ada@x.io',  'Ada Lovelace', 'London',   'INK', 'Ink bottle',    8.50, 2),
  (2, '2026-01-04', 'alan@x.io', 'Alan Turing',  'Wilmslow', 'PEN', 'Fountain pen', 25.00, 3),
  (3, '2026-01-09', 'ada@x.io',  'Ada Lovelace', 'London',   'PAD', 'Notepad',       4.00, 5);
```

```sql solution
CREATE TABLE customers (email text PRIMARY KEY, name text NOT NULL, city text);
CREATE TABLE products (sku text PRIMARY KEY, name text NOT NULL, list_price numeric(8,2) NOT NULL);
CREATE TABLE orders (order_id int PRIMARY KEY, email text NOT NULL REFERENCES customers, order_date date NOT NULL);
CREATE TABLE order_lines (
  order_id int REFERENCES orders, sku text REFERENCES products,
  quantity int NOT NULL, unit_price numeric(8,2) NOT NULL,
  PRIMARY KEY (order_id, sku)
);
INSERT INTO customers SELECT DISTINCT customer_email, customer_name, customer_city FROM orders_flat;
INSERT INTO products SELECT DISTINCT product_sku, product_name, unit_price FROM orders_flat;
INSERT INTO orders SELECT DISTINCT order_id, customer_email, order_date FROM orders_flat;
INSERT INTO order_lines SELECT order_id, product_sku, quantity, unit_price FROM orders_flat;
```

```sql check Customers, once each
SELECT email, name, city FROM customers;
```

```sql check Products, once each
SELECT sku, name, list_price FROM products;
```

```sql check Orders
SELECT order_id, email, order_date FROM orders;
```

```sql check Joining back reproduces the spreadsheet
SELECT o.order_id, o.order_date, c.email, c.name, c.city, p.sku, p.name, l.unit_price, l.quantity
FROM order_lines l JOIN orders o USING (order_id) JOIN customers c USING (email) JOIN products p USING (sku);
```

```sql check Orders need a real customer
INSERT INTO orders VALUES (9, 'ghost@x.io', '2026-02-01');
```

```sql wrong
CREATE TABLE customers (email text PRIMARY KEY, name text NOT NULL, city text);
CREATE TABLE products (sku text PRIMARY KEY, name text NOT NULL, list_price numeric(8,2) NOT NULL);
CREATE TABLE orders (order_id int, email text NOT NULL REFERENCES customers, order_date date NOT NULL);
CREATE TABLE order_lines (order_id int, sku text REFERENCES products, quantity int NOT NULL, unit_price numeric(8,2) NOT NULL);
INSERT INTO customers SELECT DISTINCT customer_email, customer_name, customer_city FROM orders_flat;
INSERT INTO products SELECT DISTINCT product_sku, product_name, unit_price FROM orders_flat;
INSERT INTO orders SELECT order_id, customer_email, order_date FROM orders_flat;
INSERT INTO order_lines SELECT order_id, product_sku, quantity, unit_price FROM orders_flat;
```
