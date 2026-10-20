---
title: Removing duplicates with DISTINCT
kind: lesson
---
`SELECT DISTINCT` removes duplicate rows from the result:

```sql
SELECT DISTINCT country FROM customers ORDER BY country;
```

With several columns, DISTINCT applies to the **whole row**. Two rows are duplicates only if every selected column matches:

```sql
SELECT DISTINCT country, city
FROM customers
ORDER BY country, city;
```

When comparing rows, DISTINCT treats NULLs as equal to each other, so customers with no city collapse into a single `(country, NULL)` row per country. That is different from `=`, where NULL never equals NULL.

## DISTINCT is not free

To remove duplicates the database has to compare rows, either by sorting them or by building a hash table. On a big table that is real work. A `DISTINCT` that "fixes" unexpected duplicates is often hiding a bug elsewhere, typically a join that matches more rows than you thought (Module 4). Use DISTINCT when you want unique values, not to make duplicates go away.

## DISTINCT ON: the first row of each group

PostgreSQL has a useful extension. `DISTINCT ON (expr)` keeps only the **first row for each distinct value of `expr`**, where "first" is defined by `ORDER BY`:

```sql
SELECT DISTINCT ON (category_id) category_id, name, price
FROM products
ORDER BY category_id, price, name;
```

That returns the cheapest product in each category, with ties broken by name. The rule: `ORDER BY` must **start with** the `DISTINCT ON` expressions. The keys after them decide which row in each group comes first.

> **Dialect note.** `DISTINCT ON` exists only in PostgreSQL (and databases derived from it). Elsewhere you'd use a window function, `ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price)`, which you'll meet in the window functions module and which also works in PostgreSQL.
