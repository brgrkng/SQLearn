---
title: Correlated subqueries, EXISTS and the NOT IN trap
kind: lesson
---
## Correlated subqueries

A **correlated** subquery refers to a column of the outer query, so conceptually it runs once per outer row. "Products priced above their *own category's* average":

```sql
SELECT p.name, p.category_id, p.price
FROM products p
WHERE p.price > (SELECT avg(p2.price) FROM products p2 WHERE p2.category_id = p.category_id)
ORDER BY p.category_id, p.price
LIMIT 10;
```

Inside the subquery, `p.category_id` is the outer row's value. The aliases (`p`, `p2`) keep the two copies of `products` apart.

## EXISTS and NOT EXISTS

`EXISTS (subquery)` is true if the subquery returns **at least one row**. What it selects doesn't matter, and `SELECT 1` is the convention:

```sql
SELECT c.customer_id, c.first_name
FROM customers c
WHERE c.country = 'Kenya'
  AND EXISTS (SELECT 1 FROM orders o
              WHERE o.customer_id = c.customer_id AND o.status = 'returned')
ORDER BY c.customer_id;
```

`NOT EXISTS` is the cleanest way to write an anti-join. For example, customers with no orders:

```sql
SELECT count(*)
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
```

## The NOT IN trap

`NOT IN` looks like the obvious way to write "not in this list". But if the subquery returns **any NULL**, `NOT IN` returns no rows at all:

```sql
SELECT count(*)
FROM customers
WHERE customer_id NOT IN (SELECT 1 UNION ALL SELECT NULL::int);
```

`x NOT IN (1, NULL)` means `x <> 1 AND x <> NULL`. The second comparison is unknown for every `x`, so the whole condition is never true. Real data runs into this whenever the subquery's column is nullable, as you'll see in the drills.

**Prefer `NOT EXISTS`.** It doesn't have this problem, and PostgreSQL optimises it into an efficient anti-join. If you do use `NOT IN`, filter the NULLs out inside the subquery.

## ANY and ALL

`x > ALL (subquery)` is true if `x` is greater than every value the subquery returns. `x = ANY (subquery)` means the same as `IN`:

```sql
SELECT name, price
FROM products
WHERE price > ALL (SELECT price FROM products WHERE category_id = 26)
ORDER BY price;
```

## Performance

PostgreSQL turns `IN` and `EXISTS` subqueries into **semi-joins**, and `NOT EXISTS` into **anti-joins**, so they're usually as fast as the equivalent join. A correlated subquery in the **SELECT list** is different: it often really does run once per row, as a *SubPlan*. Compare:

```sql
EXPLAIN SELECT c.customer_id,
       (SELECT count(*) FROM orders o WHERE o.customer_id = c.customer_id) AS orders
FROM customers c;
```

```sql
EXPLAIN SELECT c.customer_id, count(o.order_id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id;
```

The first plan scans `orders` once per customer, 5,000 times in all. The second scans it once and hashes it. An index on `orders.customer_id` would narrow the gap, but the join-and-group version is the safe default.

> **Dialect note.** `EXISTS`, `NOT EXISTS`, `ANY` and `ALL` are standard SQL. The way `NOT IN` behaves with NULL is required by the SQL standard, so it catches people out in every database.
