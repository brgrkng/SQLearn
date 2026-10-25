---
title: Working with text
kind: lesson
---
PostgreSQL has a large library of string functions. These are the ones you'll reach for most:

```sql
SELECT name,
       length(name)              AS chars,
       upper(name)               AS shouting,
       lower(name)               AS quiet,
       left(name, 4)             AS first_four,
       right(name, 4)            AS last_four,
       substring(name FROM 6 FOR 5) AS middle,
       position(' ' IN name)     AS first_space
FROM products
WHERE product_id <= 5;
```

Positions start at **1**, not 0. `substring(s FROM start FOR count)` is the standard spelling. `substr(s, start, count)` does the same thing.

## Splitting and replacing

`split_part(text, delimiter, n)` returns the *n*-th piece. It's ideal for structured strings such as emails or codes:

```sql
SELECT email,
       split_part(email, '@', 1) AS mailbox,
       split_part(email, '@', 2) AS domain,
       replace(email, '@example.com', '') AS short
FROM customers
WHERE customer_id <= 5;
```

`trim`, `ltrim` and `rtrim` strip whitespace (or any characters you name). `lpad` and `rpad` pad to a fixed width, which is handy for codes:

```sql
SELECT '  padded  '                    AS raw,
       trim('  padded  ')              AS trimmed,
       trim(BOTH '-' FROM '--x--')     AS custom,
       'ORD-' || lpad('42', 6, '0')    AS order_code;
```

## Joining strings and NULL

`||` returns NULL if any part is NULL. `concat` and `concat_ws` ("with separator") skip NULLs instead:

```sql
SELECT customer_id,
       first_name || ' from ' || city            AS with_pipes,
       concat(first_name, ' from ', city)        AS with_concat,
       concat_ws(', ', last_name, first_name, city) AS with_separator
FROM customers
WHERE customer_id IN (1, 22);
```

`format` builds strings from a template. `%s` inserts a value, and `%L` inserts it as a quoted SQL literal:

```sql
SELECT format('%s costs $%s', name, price) FROM products WHERE product_id = 1;
```

## Patterns: LIKE and regular expressions

For anything more complex than `LIKE`, PostgreSQL supports POSIX regular expressions. `~` matches case-sensitively, `~*` ignores case, and `!~` negates:

```sql
SELECT name FROM products WHERE name ~ '[0-9]';
```

```sql
SELECT email,
       regexp_replace(email, '[0-9]+', '') AS without_digits,
       (regexp_match(email, '^([a-z]+)\.'))[1] AS first_part
FROM customers
WHERE customer_id <= 3;
```

## Sorting text

How text sorts depends on the database's **collation**. The database in this course uses the simple `C` collation, which compares bytes, so `'Zebra' < 'apple'` (capital letters sort before lowercase ones). Most production databases use a language-aware collation such as `en_US.UTF-8`, where `apple` comes first. When case shouldn't matter, sort by `lower(name)`.

> **Dialect note.** SQL Server uses `LEN()` (which ignores trailing spaces), `CHARINDEX()` and `SUBSTRING()`, and has no `split_part` (use `STRING_SPLIT` or `PARSENAME`). MySQL has `SUBSTRING_INDEX()` and `LOCATE()`. Oracle uses `SUBSTR`, `INSTR` and `LENGTH`. Oracle and MySQL support regular expressions through `REGEXP_LIKE` and friends. SQL Server only gained them in SQL Server 2025. Before that, `LIKE` with `[a-z]` character classes was as close as it got.
