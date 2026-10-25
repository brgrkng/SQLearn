---
title: Inner joins
kind: lesson
---
An order row stores `customer_id`, not the customer's name. To show both, match each order to the customer whose key it holds:

```sql
SELECT o.order_id, o.order_date, c.first_name, c.last_name
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
WHERE o.order_date = '2025-06-01';
```

- `JOIN ... ON condition` pairs every row of the left table with every row of the right table for which the condition is true. `JOIN` means `INNER JOIN`.
- `o` and `c` are **table aliases**. Once you've given one, use it to **qualify** columns (`o.order_id`). This is required when both tables have a column with that name, and kind to readers everywhere else.
- `orders.customer_id` is a **foreign key**: it references `customers.customer_id`. Joining a foreign key to the key it references is by far the most common join.

An inner join only returns rows that found a partner. An order whose customer didn't exist would disappear (the foreign key constraint prevents that here).

## More than two tables

Each `JOIN` adds one table. To list the products on an order with their category names:

```sql
SELECT oi.order_id, p.name AS product, cat.name AS category, oi.quantity, oi.unit_price
FROM order_items AS oi
JOIN products   AS p   ON p.product_id = oi.product_id
JOIN categories AS cat ON cat.category_id = p.category_id
WHERE oi.order_id = 1234;
```

## Joins and aggregates

Join first, then group. Revenue per category name:

```sql
SELECT cat.name, sum(oi.quantity * oi.unit_price) AS revenue
FROM order_items AS oi
JOIN products   AS p   ON p.product_id = oi.product_id
JOIN categories AS cat ON cat.category_id = p.category_id
GROUP BY cat.name
ORDER BY revenue DESC;
```

## USING and NATURAL

When the join columns have the **same name** in both tables, `USING` is a shorthand, and the shared column appears only once in `SELECT *`:

```sql
SELECT order_id, product_id, quantity, name, price
FROM order_items
JOIN products USING (product_id)
WHERE order_id = 1234;
```

`NATURAL JOIN` joins on *every* column name the tables share. Avoid it: adding an unrelated column such as `updated_at` to both tables silently changes the join.

## The old comma syntax

You'll see older code join with commas and put the condition in WHERE:

```sql norun
SELECT o.order_id, c.last_name
FROM orders o, customers c
WHERE c.customer_id = o.customer_id;
```

It means the same thing, but forgetting the condition gives a silent cross join (every order paired with every customer). Prefer explicit `JOIN ... ON`.

> **Dialect note.** `JOIN ... ON` and `USING` are standard and work everywhere (SQL Server lacks `USING`). Oracle code sometimes uses `(+)` for outer joins in the comma syntax, a legacy notation you should read but not write.
