---
title: Foreign keys
kind: lesson
dataset: empty
cumulative: true
---
A **foreign key** says that a value in one table must exist as a key in another table:

```sql
CREATE TABLE customers (customer_id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE orders (
  order_id    int PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customers (customer_id),
  placed_on   date NOT NULL
);
INSERT INTO customers VALUES (1, 'Ada'), (2, 'Alan');
INSERT INTO orders VALUES (10, 1, '2026-01-02'), (11, 1, '2026-01-09'), (12, 2, '2026-01-10');
SELECT * FROM orders;
```

The database now refuses **orphans**, meaning orders for customers that don't exist:

```sql error
INSERT INTO orders VALUES (13, 99, '2026-01-11');
```

A NULL foreign key is allowed unless the column is also `NOT NULL`. NULL means "no related row", like an employee without a manager.

## What happens when the parent changes?

By default you can't delete a customer who still has orders (`NO ACTION`/`RESTRICT`):

```sql error
DELETE FROM customers WHERE customer_id = 1;
```

You choose the behaviour per foreign key:

| `ON DELETE ...` | When the parent row is deleted |
|---|---|
| `NO ACTION` / `RESTRICT` (default) | the delete fails while children exist |
| `CASCADE` | the children are deleted too |
| `SET NULL` | the children's foreign key becomes NULL |
| `SET DEFAULT` | the children's foreign key gets its default |

```sql
CREATE TABLE order_lines (
  order_id int REFERENCES orders ON DELETE CASCADE,
  line_no  int,
  sku      text NOT NULL,
  PRIMARY KEY (order_id, line_no)
);
INSERT INTO order_lines VALUES (10, 1, 'PEN'), (10, 2, 'INK'), (11, 1, 'PAD');
DELETE FROM orders WHERE order_id = 10;
SELECT * FROM order_lines;
```

Choose deliberately. `CASCADE` suits things that only exist as part of their parent (order lines, comments on a deleted post). `SET NULL` suits optional links (an employee whose manager left). `RESTRICT` suits everything that must not disappear by accident (a customer with orders). `ON UPDATE CASCADE` exists too, but if your keys change you probably want a surrogate key.

## Self-references and composite keys

A table can reference itself, like `employees.manager_id → employees.employee_id`. A foreign key can also span several columns, matching a composite primary key: `FOREIGN KEY (student_id, course_id) REFERENCES enrollments`.

## Deferrable constraints

Constraints are normally checked at the end of **each statement**. Some valid changes pass through an invalid intermediate state, such as inserting two rows that reference each other. Declaring a foreign key `DEFERRABLE INITIALLY DEFERRED` postpones the check until `COMMIT`:

```sql
CREATE TABLE people (
  person_id int PRIMARY KEY,
  partner_id int REFERENCES people DEFERRABLE INITIALLY DEFERRED
);
BEGIN;
INSERT INTO people VALUES (1, 2);   -- person 2 doesn't exist yet
INSERT INTO people VALUES (2, 1);
COMMIT;
SELECT * FROM people;
```

## Index your foreign keys

PostgreSQL indexes the *referenced* key (it's a primary key), but **not** the referencing column. Without an index on `orders.customer_id`, every delete from `customers` has to scan `orders` to check for children, and so does every join from customer to orders. Indexing foreign key columns is almost always right. You'll do it in Module 12.

> **Dialect note.** Foreign keys work the same way everywhere, with small differences: SQL Server has no `RESTRICT` keyword (use `NO ACTION`) and no deferrable constraints, and Oracle has no `ON UPDATE` actions. MySQL's InnoDB requires (and automatically creates) an index on the referencing column.
