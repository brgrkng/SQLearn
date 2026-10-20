---
title: Choosing columns and computing values
kind: lesson
---
`SELECT *` is handy for exploring, but real queries name the columns they need:

```sql
SELECT name, price FROM products;
```

Columns come back in the order you list them, and you can list the same column twice. Naming columns explicitly also documents your intent, keeps the query working when someone adds a column to the table, and avoids shipping data nobody reads.

## Expressions

The `SELECT` list can hold any **expression**, not just column names. You can do arithmetic, call functions and use literal values:

```sql
SELECT name,
       price,
       price * 1.2           AS price_with_vat,
       round(price * 0.9, 2) AS member_price,
       'in stock'            AS note
FROM products;
```

`AS` gives a result column its name, called an **alias**. Without one, PostgreSQL makes up a name such as `?column?`. The alias only renames the output. The table is unchanged.

Watch out for **integer division**. When both sides are integers, `/` throws away the remainder:

```sql
SELECT 7 / 2      AS integer_division,
       7 % 2      AS remainder,
       7 / 2.0    AS decimal_division,
       7::numeric / 2 AS cast_first;
```

`::numeric` is PostgreSQL shorthand for `CAST(7 AS numeric)`. Converting either operand to a non-integer type gives you the fractional result.

## Text

Strings go in **single quotes**. `||` joins (concatenates) them:

```sql
SELECT first_name || ' ' || last_name AS full_name, country
FROM customers;
```

**Double quotes are for identifiers**, meaning the names of tables, columns and aliases. You need them only when a name has spaces or capital letters you want to keep:

```sql
SELECT name AS "Product Name", price AS "Price (USD)" FROM products;
```

PostgreSQL folds unquoted identifiers to lower case, so `SELECT Name FROM Products` works, but `"Name"` would look for a column with a capital N and fail:

```sql error
SELECT "Name" FROM products;
```

## Small print

- Keywords are case-insensitive. `select`, `SELECT` and `SeLeCt` all work. This course writes keywords in capitals so they stand out.
- Line breaks and indentation don't matter. Use them for readability.
- `--` starts a comment that runs to the end of the line, and `/* ... */` can span several lines.
- A `;` ends a statement. You can run several statements at once, and the editor shows each result.

> **Dialect note.** MySQL concatenates with `CONCAT(a, b)`: in MySQL `||` means OR unless you change the SQL mode. SQL Server uses `a + b` or `CONCAT`. For quoted identifiers, MySQL uses backticks (`` `Product Name` ``) and SQL Server uses brackets (`[Product Name]`). Oracle folds unquoted names to UPPER case, the opposite of PostgreSQL.
