---
title: Scalar, IN and derived-table subqueries
kind: lesson
---
## Scalar subqueries

A subquery that returns **one row and one column** can be used anywhere a single value can:

```sql
SELECT name, price
FROM products
WHERE price > (SELECT avg(price) FROM products)
ORDER BY price
LIMIT 5;
```

```sql
SELECT name, price, round(price - (SELECT avg(price) FROM products), 2) AS vs_average
FROM products
WHERE category_id = 8;
```

If a scalar subquery returns no rows, its value is NULL. If it returns more than one row, the query fails:

```sql error
SELECT name FROM products WHERE price = (SELECT price FROM products WHERE category_id = 8);
```

## IN (subquery)

`IN` accepts a subquery that returns one column. The condition is true when the value appears anywhere in the result:

```sql
SELECT customer_id, first_name, last_name
FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders WHERE order_date = '2025-12-25')
ORDER BY customer_id;
```

Unlike a join, `IN` never duplicates the outer rows: a customer with three Christmas orders still appears once. This is a **semi-join**.

## Derived tables: subqueries in FROM

A subquery in `FROM` acts as a temporary table. It must have an alias. This is how you aggregate twice, for example the average number of orders *per customer*:

```sql
SELECT round(avg(n), 2) AS avg_orders, max(n) AS most_orders
FROM (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id) AS per_customer;
```

You can join a derived table like any other table. This is the "aggregate first, then join" fix from the fan-out lesson.

## Readability

Deeply nested subqueries get hard to read from the inside out. The next module introduces `WITH` (common table expressions), which lets you name each step and read the query top to bottom. Most of what you learn here can be rewritten that way.

> **Dialect note.** Scalar, IN and derived-table subqueries are standard and work everywhere. MySQL before 8.0 optimised `IN (subquery)` poorly, which is why older MySQL code rewrites them as joins.
