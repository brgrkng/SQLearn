---
title: Filtering rows with WHERE
kind: lesson
---
`WHERE` keeps only the rows for which a condition is **true**:

```sql
SELECT name, price
FROM products
WHERE price < 10;
```

## Comparisons

| Operator | Meaning |
|---|---|
| `=` | equal (one `=`, not `==`) |
| `<>` or `!=` | not equal |
| `<`, `<=`, `>`, `>=` | less / greater than (or equal) |

Comparisons work on numbers, text (alphabetical) and dates. Write text and date literals in **single quotes**:

```sql
SELECT order_id, customer_id, status
FROM orders
WHERE order_date = '2024-01-01';
```

PostgreSQL sees that `order_date` is a `date` and reads `'2024-01-01'` as one. You can be explicit with `DATE '2024-01-01'`. Always write dates as `YYYY-MM-DD`, the ISO format every database understands.

## Combining conditions: AND, OR, NOT

```sql
SELECT name, price, stock
FROM products
WHERE price < 20 AND stock > 200;
```

`AND` binds more tightly than `OR`, just as `*` binds more tightly than `+`. This catches everyone at least once. "Laptops or ultrabooks under $1000" written without parentheses:

```sql
SELECT name, price
FROM products
WHERE name LIKE '%Laptop' OR name LIKE '%Ultrabook' AND price < 1000;
```

That reads as `Laptop OR (Ultrabook AND price < 1000)`, so every laptop comes back, even the $1,498.99 one. Parentheses say what you mean:

```sql
SELECT name, price
FROM products
WHERE (name LIKE '%Laptop' OR name LIKE '%Ultrabook') AND price < 1000;
```

**Whenever you mix AND and OR, add parentheses**, even where they aren't strictly needed.

`NOT` negates a condition: `WHERE NOT discontinued`, `WHERE NOT (price > 100 AND stock = 0)`.

## IN and BETWEEN

`IN` is shorthand for several `OR`ed equality checks:

```sql
SELECT customer_id, first_name, country
FROM customers
WHERE country IN ('Kenya', 'Nigeria');
```

`BETWEEN a AND b` is shorthand for `>= a AND <= b`. **Both ends are included**:

```sql
SELECT name, price FROM products WHERE price BETWEEN 45.99 AND 46.99;
```

For date ranges, prefer a **half-open range**, `>=` the start and `<` the day after the end:

```sql
SELECT order_id, order_date
FROM orders
WHERE order_date >= '2025-02-01' AND order_date < '2025-03-01';
```

You don't need to know how many days February has. The same query keeps working if the column later becomes a `timestamp`, where `BETWEEN '2025-02-01' AND '2025-02-28'` would quietly lose everything that happened after midnight on the 28th.

## Pattern matching: LIKE and ILIKE

`LIKE` matches text against a pattern. `%` stands for any run of characters (including none) and `_` for exactly one character:

```sql
SELECT name FROM products WHERE name LIKE 'Zenith%';
```

`LIKE` is **case-sensitive** in PostgreSQL. `ILIKE` is the case-insensitive version:

```sql
SELECT name FROM products WHERE name ILIKE '%book%';
```

`NOT LIKE`, `NOT ILIKE`, `NOT IN` and `NOT BETWEEN` all work as you'd expect. To match a literal `%` or `_`, escape it: `LIKE '100\%%'`.

> **Dialect note.** `ILIKE` is PostgreSQL-only. In MySQL and SQL Server, `LIKE` is usually case-insensitive already, because their default collations ignore case. In Oracle, use `UPPER(name) LIKE '%BOOK%'`. Oracle also treats the empty string `''` as NULL, which changes how text comparisons behave there.
