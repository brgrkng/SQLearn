---
title: HAVING, FILTER and filtering early
kind: lesson
---
## HAVING filters groups

`WHERE` removes rows *before* grouping. `HAVING` removes groups *after* aggregating, so it can use aggregates:

```sql
SELECT customer_id, count(*) AS orders
FROM orders
GROUP BY customer_id
HAVING count(*) >= 40
ORDER BY orders DESC;
```

## WHERE or HAVING?

If a condition doesn't involve an aggregate, put it in `WHERE`. These two queries return the same rows:

```sql
EXPLAIN SELECT order_date, count(*) FROM orders
GROUP BY order_date
HAVING order_date >= '2025-06-01' AND order_date < '2025-06-08';
```

```sql
EXPLAIN SELECT order_date, count(*) FROM orders
WHERE order_date >= '2025-06-01' AND order_date < '2025-06-08'
GROUP BY order_date;
```

Look at the plans: they're identical. PostgreSQL noticed that the HAVING condition doesn't use an aggregate and moved it into WHERE for you, so it filters through the `order_date` index *before* grouping. Not every database does this, and the version with `WHERE` says what you mean. Keep row conditions in `WHERE` and group conditions in `HAVING`.

The two are *not* interchangeable when a condition depends on the group. "Customers with more than 30 orders in total" needs `HAVING count(*) > 30` over **all** their orders. Adding `WHERE order_date >= '2025-01-01'` would change which orders are counted, and so which customers qualify.

## Conditional aggregates with FILTER

Often you want several counts over different subsets in **one pass**, for example customers per country and how many of them are gold. `FILTER (WHERE ...)` restricts what a single aggregate sees:

```sql
SELECT country,
       count(*)                                        AS customers,
       count(*) FILTER (WHERE loyalty_tier = 'gold')   AS gold,
       count(*) FILTER (WHERE email IS NULL)           AS no_email
FROM customers
GROUP BY country
ORDER BY country;
```

The portable spelling uses `CASE` inside the aggregate. It works in every database:

```sql
SELECT country,
       sum(CASE WHEN loyalty_tier = 'gold' THEN 1 ELSE 0 END) AS gold,
       count(CASE WHEN email IS NULL THEN 1 END)               AS no_email
FROM customers
GROUP BY country
ORDER BY country;
```

## Pivoting

Conditional aggregates turn values into **columns**. This is called a *pivot*:

```sql
SELECT extract(year FROM order_date) AS year,
       count(*) FILTER (WHERE status = 'delivered') AS delivered,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       count(*) FILTER (WHERE status = 'returned')  AS returned
FROM orders
GROUP BY year
ORDER BY year;
```

## Ratios

Averaging a boolean cast to an integer gives a proportion:

```sql
SELECT country,
       round(100.0 * count(email) / count(*), 1)      AS pct_with_email,
       round(avg((loyalty_tier IS NOT NULL)::int), 3) AS share_with_tier
FROM customers
GROUP BY country
ORDER BY country;
```

Note the `100.0`. Without it, `count(email) * 100 / count(*)` is integer division.

> **Dialect note.** `FILTER` is standard SQL but supported only by PostgreSQL and SQLite. In MySQL, SQL Server and Oracle, use the `CASE` form. SQL Server and Oracle also have a dedicated `PIVOT` operator.
