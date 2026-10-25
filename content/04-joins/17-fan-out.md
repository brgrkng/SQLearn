---
title: Fan-out, and how joins run
kind: lesson
---
## Joins multiply rows

A join returns **one row per matching pair**. Join a customer to their 30 orders and you get 30 rows. Join those orders to their order lines and you get one row per *line*. Every aggregate after the join counts those multiplied rows:

```sql
SELECT c.customer_id,
       count(*)                   AS rows_after_join,
       count(DISTINCT o.order_id) AS orders,
       sum(oi.quantity)           AS units
FROM customers c
JOIN orders o       ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
WHERE c.customer_id = 42
GROUP BY c.customer_id;
```

`count(*)` here counts order lines, not orders. This is called **fan-out**, and it causes most "my totals are too big" bugs.

The worst case is joining two independent one-to-many relationships in the same query, such as a department's employees *and* its projects. Every employee pairs with every project, so both counts get multiplied. You'll fix exactly that in a drill.

## The fix: aggregate before you join

Compute each one-to-many total separately, then join the per-key results. Each side has exactly one row per key, so nothing multiplies:

```sql
SELECT c.customer_id, o.orders, u.units
FROM customers c
JOIN (SELECT customer_id, count(*) AS orders FROM orders GROUP BY customer_id) o
  ON o.customer_id = c.customer_id
JOIN (SELECT o.customer_id, sum(oi.quantity) AS units
      FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
      GROUP BY o.customer_id) u
  ON u.customer_id = c.customer_id
WHERE c.customer_id = 42;
```

`count(DISTINCT ...)` rescues counts, but **not sums**: there is no "sum of distinct rows". When totals look inflated, don't reach for `DISTINCT`. Find the join that fans out.

## How PostgreSQL executes a join

The planner chooses one of three algorithms for each join:

| Algorithm | How it works | Good when |
|---|---|---|
| **Nested loop** | For each outer row, look up matching inner rows | The outer side is small and the inner side has an index on the join key |
| **Hash join** | Build a hash table of one side, then probe it with the other | Large unsorted inputs, equality joins |
| **Merge join** | Walk two inputs sorted on the join key in step | Both inputs already sorted (e.g. by an index) |

```sql
EXPLAIN SELECT o.order_id, c.last_name
FROM orders o JOIN customers c ON c.customer_id = o.customer_id
WHERE o.order_date = '2025-06-01';
```

```sql
EXPLAIN SELECT c.last_name, o.order_id
FROM customers c JOIN orders o ON o.customer_id = c.customer_id
WHERE c.customer_id = 42;
```

The first plan finds one day's orders through the `order_date` index, then looks up each customer by primary key (a nested loop). The second has to scan **all** of `orders`, because nothing indexes `orders.customer_id`. PostgreSQL does **not** automatically index foreign key columns. Adding that index is one of the first exercises in the indexes module.

> **Dialect note.** Every major database uses the same three join algorithms. MySQL only gained hash joins in 8.0.18; before that it used nested loops exclusively, which is why "always index your join columns" is MySQL folklore.
