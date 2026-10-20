---
title: Sorting and limiting
kind: lesson
---
Without `ORDER BY`, the database may return rows in **any order it likes**. Often that is the order the rows were inserted, but it can change after an update, a vacuum, a new index or a parallel plan. If the order matters, say so:

```sql
SELECT name, price
FROM products
ORDER BY price DESC;
```

`ASC` (ascending) is the default, and `DESC` reverses it.

## Several sort keys

When the first key ties, the second decides, and so on:

```sql
SELECT country, signup_date, customer_id
FROM customers
ORDER BY country, signup_date DESC, customer_id;
```

Each key has its own direction: here countries go A→Z, the newest signups come first within a country, and `customer_id` breaks any remaining ties.

You can sort by an expression or by an output alias. You can even sort by a column you aren't selecting:

```sql
SELECT name, price * 1.2 AS with_vat
FROM products
ORDER BY with_vat DESC, stock;
```

## Where do NULLs go?

PostgreSQL treats NULL as **larger than every value**: NULLs come last in `ASC` order and **first** in `DESC` order. That second case is rarely what you want:

```sql
SELECT order_id, shipped_date
FROM orders
ORDER BY shipped_date DESC
LIMIT 5;
```

These are unshipped orders, not the most recent shipments. Override it with `NULLS LAST` or `NULLS FIRST`:

```sql
SELECT order_id, shipped_date
FROM orders
ORDER BY shipped_date DESC NULLS LAST, order_id
LIMIT 5;
```

## LIMIT and OFFSET

`LIMIT n` keeps the first *n* rows of the sorted result. `OFFSET k` skips *k* rows first, which gives you pages:

```sql
SELECT product_id, name
FROM products
ORDER BY name
LIMIT 10 OFFSET 10;   -- page 2, at 10 per page
```

Two rules for top-N queries and pagination:

1. **Always `ORDER BY` with `LIMIT`.** Otherwise "the first 10" means *some* 10.
2. **Make the order unique.** If several rows tie on the sort key, the database can order them differently from one run to the next, and rows can repeat or vanish between pages. Add a unique column, usually the primary key, as the last sort key.

The SQL standard spells `LIMIT` as `FETCH FIRST n ROWS ONLY`, and PostgreSQL supports that too. Its `WITH TIES` option also keeps any rows that tie with the last one:

```sql
SELECT name, price
FROM products
ORDER BY price
FETCH FIRST 3 ROWS WITH TIES;
```

Large `OFFSET`s get slow: to return rows 40,001–40,020 the database still has to produce and discard the first 40,000. The last lesson of this module shows how to measure that and how to avoid it.

> **Dialect note.** SQL Server uses `SELECT TOP 10 ...` or `ORDER BY ... OFFSET 10 ROWS FETCH NEXT 10 ROWS ONLY`. Oracle 12c+ supports `FETCH FIRST`, and older Oracle code uses `ROWNUM`. MySQL and SQLite use `LIMIT`. NULL ordering differs too: **MySQL and SQL Server put NULLs first** in ascending order, the opposite of PostgreSQL and Oracle, and only PostgreSQL, Oracle and SQLite support `NULLS FIRST/LAST`.
