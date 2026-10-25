---
title: Numbers, rounding and casting
kind: lesson
---
## Exact and approximate numbers

PostgreSQL has two families of non-integer numbers:

- **`numeric(p, s)`** is exact decimal arithmetic. Use it for money and anything else that must add up to the cent. The shop's `price` is `numeric(10,2)`.
- **`real` / `double precision`** are binary floating point: fast, but approximate.

```sql
SELECT 0.1 + 0.2                                AS numeric_sum,
       0.1::float8 + 0.2::float8                AS float_sum,
       0.1::float8 + 0.2::float8 = 0.3::float8  AS float_equal;
```

A bare literal like `0.1` is `numeric` in PostgreSQL, which is why the first column is exact.

## Rounding

```sql
SELECT x,
       round(x)     AS round_0,
       round(x, 1)  AS round_1,
       trunc(x, 1)  AS trunc_1,
       ceil(x)      AS ceil,
       floor(x)     AS floor
FROM (VALUES (2.45), (-2.45), (2.5)) AS t(x);
```

`round` on a `numeric` rounds halves away from zero. `trunc` simply cuts digits off. `ceil` and `floor` go to the next whole number up or down. (`VALUES` builds a small inline table. It's handy for experimenting.)

## Division and NULLIF

Dividing by zero is an error, not NULL:

```sql error
SELECT 10 / 0;
```

`nullif(a, b)` returns NULL when `a = b`, which turns "divide by zero" into a NULL result:

```sql
SELECT name, stock, price, round(price / nullif(stock, 0), 2) AS price_per_unit_in_stock
FROM products
WHERE product_id <= 6;
```

Other everyday functions: `abs`, `power(x, y)`, `sqrt`, `mod(a, b)` (same as `%`), `sign`, and `greatest(...)` / `least(...)` across several values.

## Casting

`CAST(expr AS type)` and PostgreSQL's shorthand `expr::type` convert between types:

```sql
SELECT '42'::int + 1         AS from_text,
       42::text || '!'       AS to_text,
       '2025-03-05'::date    AS a_date,
       3.7::int              AS rounds,
       'true'::boolean       AS a_bool,
       CAST(price AS int)    AS whole_dollars
FROM products
WHERE product_id = 1;
```

Casting to `int` **rounds** (`3.7::int` is 4), whereas `trunc` cuts. A string that doesn't parse raises an error:

```sql error
SELECT 'twelve'::int;
```

## Formatting numbers for display

`to_char(number, pattern)` formats a number as text: `9` is a digit, `0` is a digit with zero padding, `G` and `D` are the locale's group and decimal separators, and `FM` drops padding:

```sql
SELECT price,
       to_char(price, 'FM999,990.00') AS formatted,
       to_char(price * 1000, 'FM9G999G999') AS big
FROM products
WHERE product_id IN (1, 200, 300);
```

Formatting belongs at the edge of your system. Keep numbers as numbers while you compute, and format them only for display, since sorting `'100.00'` and `'9.00'` as text puts them in the wrong order.

> **Dialect note.** MySQL's `/` always returns a decimal (`DIV` is integer division) and dividing by zero gives NULL with a warning instead of an error. SQL Server truncates integer division like PostgreSQL. `TRY_CAST` (SQL Server) and `CAST ... DEFAULT ... ON CONVERSION ERROR` (Oracle) return NULL instead of failing. PostgreSQL has no built-in equivalent; you'd write a small function or validate with a regular expression first.
