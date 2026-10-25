---
title: "Why design matters: anomalies"
kind: lesson
dataset: empty
cumulative: true
---
Imagine tracking orders in one wide table, the way a spreadsheet would:

```sql
CREATE TABLE orders_flat (
  order_id       int,
  order_date     date,
  customer_email text,
  customer_name  text,
  customer_city  text,
  product_sku    text,
  product_name   text,
  unit_price     numeric(8,2),
  quantity       int
);
INSERT INTO orders_flat VALUES
  (1, '2026-01-03', 'ada@x.io',  'Ada Lovelace', 'London', 'PEN', 'Fountain pen', 25.00, 1),
  (1, '2026-01-03', 'ada@x.io',  'Ada Lovelace', 'London', 'INK', 'Ink bottle',    8.50, 2),
  (2, '2026-01-04', 'alan@x.io', 'Alan Turing',  'Wilmslow', 'PEN', 'Fountain pen', 25.00, 3),
  (3, '2026-01-09', 'ada@x.io',  'Ada Lovelace', 'London', 'PAD', 'Notepad',       4.00, 5);
SELECT * FROM orders_flat;
```

It works until the data changes. The same facts are stored many times, and that causes three kinds of **anomaly**:

- **Update anomaly.** Ada moves to Cambridge. Her city is stored on three rows, so update two of them and the database now contains two different answers to "where does Ada live?"
- **Insert anomaly.** You can't record a new product, or a customer who hasn't ordered yet, without inventing a fake order to hang it on.
- **Delete anomaly.** Delete order 2 and you also lose the only record that Alan Turing is a customer.

```sql
UPDATE orders_flat SET customer_city = 'Cambridge' WHERE order_id = 1;   -- forgot order 3
SELECT DISTINCT customer_name, customer_city FROM orders_flat ORDER BY 1;
```

## The fix: one fact, one place

The cure is to give each *kind of thing* its own table and connect them with keys:

```sql
CREATE TABLE customers (customer_id int PRIMARY KEY, email text NOT NULL UNIQUE, name text NOT NULL, city text);
CREATE TABLE products  (sku text PRIMARY KEY, name text NOT NULL, unit_price numeric(8,2) NOT NULL);
CREATE TABLE orders    (order_id int PRIMARY KEY, customer_id int NOT NULL REFERENCES customers, order_date date NOT NULL);
CREATE TABLE order_lines (
  order_id int REFERENCES orders,
  sku      text REFERENCES products,
  quantity int NOT NULL CHECK (quantity > 0),
  unit_price numeric(8,2) NOT NULL,   -- the price *paid*, which can differ from today's list price
  PRIMARY KEY (order_id, sku)
);
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1;
```

Now Ada's city lives in exactly one row. New products and customers can exist on their own. Deleting an order deletes only the order.

Notice `order_lines.unit_price`. The price **at the time of the order** is a different fact from the product's **current** price, so storing it on the line isn't redundancy. Telling apart "the same fact repeated" from "a different fact that happens to look alike" is a core design skill.

## The process

1. **Gather requirements.** What questions must the data answer? What rules must always hold?
2. **Find the entities.** These are the nouns that have their own identity and attributes: customer, product, order.
3. **Find the relationships** and their cardinality: one-to-many, many-to-many, one-to-one.
4. **Choose keys** and turn it all into tables, columns and constraints.
5. **Check for redundancy** with the normal forms (coming up). Then decide, deliberately, where to denormalize.

> **Dialect note.** Design principles are independent of the database. What varies is how much each database lets you *enforce*: PostgreSQL's CHECK, exclusion and partial-index features let you encode more rules in the schema than most.
