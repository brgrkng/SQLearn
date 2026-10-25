---
title: CASE expressions
kind: lesson
---
`CASE` is SQL's if/else. It's an **expression**, so it can go anywhere a value can: in `SELECT`, `WHERE`, `ORDER BY`, or inside a function call.

## Searched CASE

Conditions are tested top to bottom, and the first true one wins:

```sql
SELECT name, price,
       CASE
         WHEN price < 25  THEN 'budget'
         WHEN price < 100 THEN 'mid-range'
         ELSE 'premium'
       END AS band
FROM products
WHERE category_id = 11;
```

Because the first match wins, the second branch doesn't need `price >= 25`. If no branch matches and there's no `ELSE`, the result is **NULL**.

## Simple CASE

When every branch compares the same expression for equality, the short form reads better:

```sql
SELECT order_id, status,
       CASE status
         WHEN 'pending'   THEN 'Awaiting dispatch'
         WHEN 'shipped'   THEN 'On its way'
         WHEN 'delivered' THEN 'Delivered'
         ELSE 'Closed'
       END AS customer_message
FROM orders
WHERE order_date = '2025-12-28';
```

Simple CASE compares with `=`, so **`WHEN NULL` never matches**. To handle NULL, use the searched form (`WHEN loyalty_tier IS NULL THEN ...`) or wrap the expression in `coalesce`.

## CASE in ORDER BY: custom sort orders

Alphabetical order is rarely the order you want for statuses. Map each one to a number:

```sql
SELECT order_id, status
FROM orders
WHERE order_date = '2025-12-28'
ORDER BY CASE status WHEN 'pending' THEN 1 WHEN 'shipped' THEN 2 WHEN 'delivered' THEN 3
                     WHEN 'returned' THEN 4 ELSE 5 END,
         order_id;
```

## CASE inside other expressions

```sql
SELECT name, price,
       round(price * CASE WHEN discontinued THEN 0.5 ELSE 1 END, 2) AS sale_price
FROM products
WHERE category_id = 22;
```

All branches must produce compatible types. Mixing `'none'` with a number fails, so cast if you need to.

## Related shortcuts

- `coalesce(a, b, ...)`: the first non-NULL value.
- `nullif(a, b)`: NULL if `a = b`, otherwise `a`.
- `greatest(...)` / `least(...)`: the largest or smallest of several values. NULLs are ignored.

```sql
SELECT name, stock, least(stock, 99) AS shown_stock, greatest(price - 10, 5) AS floor_price
FROM products
WHERE product_id <= 5;
```

> **Dialect note.** `CASE` is standard SQL and works everywhere. You'll also meet shortcuts: `IIF(cond, a, b)` in SQL Server, `IF(cond, a, b)` in MySQL, and `DECODE(expr, v1, r1, ..., default)` in Oracle (which, unusually, treats two NULLs as a match).
