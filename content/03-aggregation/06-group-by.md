---
title: GROUP BY
kind: lesson
---
`GROUP BY` splits the rows into groups that share the same value(s) and runs the aggregates once per group:

```sql
SELECT country, count(*) AS customers
FROM customers
GROUP BY country
ORDER BY customers DESC, country;
```

Each output row is one group. Here that's one row per country.

## The rule

Every column in the `SELECT` list must be either **in the GROUP BY** or **inside an aggregate**. Otherwise, which of the country's 400 cities should the database show?

```sql error
SELECT country, city, count(*) FROM customers GROUP BY country;
```

PostgreSQL relaxes the rule in one case. If you group by a table's **primary key**, you may select any other column of that table, because the key determines it (a *functional dependency*):

```sql
SELECT customer_id, first_name, last_name, count(*) AS rows_in_group
FROM customers
GROUP BY customer_id
LIMIT 3;
```

Each group here is a single customer, so `count(*)` is always 1. The point is that `first_name` is allowed without being grouped.

## Grouping by several columns or by expressions

```sql
SELECT extract(year FROM order_date) AS year, status, count(*) AS orders
FROM orders
GROUP BY year, status
ORDER BY year, status;
```

You can group by an output alias (`year`), a position (`GROUP BY 1, 2`) or a full expression. `date_trunc` is the usual way to bucket time:

```sql
SELECT date_trunc('month', order_date)::date AS month, count(*) AS orders
FROM orders
WHERE order_date >= '2025-01-01'
GROUP BY month
ORDER BY month;
```

## NULL forms its own group

For grouping purposes NULLs count as equal, so all customers without a tier land in one group:

```sql
SELECT loyalty_tier, count(*) FROM customers GROUP BY loyalty_tier ORDER BY loyalty_tier;
```

## Order of evaluation

SQL is written `SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY`, but it is *logically evaluated* in this order:

1. `FROM`: which rows exist
2. `WHERE`: filter individual rows
3. `GROUP BY`: form groups
4. `HAVING`: filter groups
5. `SELECT`: compute output columns (aliases are born here)
6. `ORDER BY`, `LIMIT`

That's why `WHERE` can't use an aggregate (the groups don't exist yet) and why `WHERE` can't see `SELECT` aliases. PostgreSQL lets `GROUP BY` and `ORDER BY` use aliases as a convenience.

> **Dialect note.** MySQL historically allowed selecting non-grouped columns and returned an arbitrary value. Modern MySQL enables `ONLY_FULL_GROUP_BY` by default, which behaves like PostgreSQL. SQL Server and Oracle don't allow grouping by aliases or positions; repeat the expression.
