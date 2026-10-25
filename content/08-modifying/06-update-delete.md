---
title: UPDATE and DELETE
kind: lesson
---
## UPDATE

`UPDATE` changes columns in the rows that match `WHERE`:

```sql
UPDATE products
SET price = round(price * 1.10, 2)
WHERE category_id = 24
RETURNING product_id, name, price;
```

Several columns can change at once, and the right-hand sides see the **old** values of the row:

```sql
UPDATE products
SET stock = stock + 50, discontinued = false
WHERE product_id = 6
RETURNING product_id, stock, discontinued;
```

**Forgetting `WHERE` updates every row in the table.** A good habit: write the `WHERE` first, run it as a `SELECT` to see which rows match, then turn it into an `UPDATE`.

## UPDATE with data from another table

`UPDATE ... FROM` joins to other tables to decide the new values. The join condition goes in `WHERE`:

```sql
CREATE TABLE price_changes (product_id int PRIMARY KEY, new_price numeric(10,2));
INSERT INTO price_changes VALUES (1, 55.00), (2, 31.50);

UPDATE products p
SET price = pc.new_price
FROM price_changes pc
WHERE pc.product_id = p.product_id
RETURNING p.product_id, p.name, p.price;
```

Make sure each target row matches **at most one** row in the `FROM` table. If it matches several, PostgreSQL picks one arbitrarily.

## DELETE

```sql
DELETE FROM order_items
WHERE order_id IN (SELECT order_id FROM orders WHERE status = 'cancelled' AND order_date < '2022-02-01')
RETURNING order_id, product_id;
```

`DELETE ... USING` is the join form, the counterpart of `UPDATE ... FROM`:

```sql
DELETE FROM order_items oi
USING orders o
WHERE o.order_id = oi.order_id AND o.status = 'cancelled' AND o.order_date < '2022-02-01';
```

Foreign keys protect related rows. You can't delete an order while order lines still reference it, unless the foreign key was declared `ON DELETE CASCADE` (Module 10):

```sql error
DELETE FROM orders WHERE order_id = 1;
```

`TRUNCATE table` removes every row instantly, without scanning. It's useful for staging tables, but it can't have a `WHERE`.

## Think in sets

One `UPDATE` that changes 10,000 rows is far faster than 10,000 single-row `UPDATE`s sent from application code. Each statement carries parsing, planning, network and transaction overhead. When you catch yourself writing a loop around SQL, look for the set-based statement instead. `UPDATE ... FROM` and `INSERT ... SELECT` usually do the job.

> **Dialect note.** SQL Server writes the join form as `UPDATE p SET ... FROM products p JOIN ...` and `DELETE oi FROM order_items oi JOIN ...`. MySQL uses `UPDATE products p JOIN price_changes pc ON ... SET ...` and the multi-table `DELETE oi FROM ...`. Oracle uses `MERGE` or correlated subqueries for these.
