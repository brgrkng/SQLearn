---
title: NULL and three-valued logic
kind: lesson
---
Some customers never gave an email address. Some orders haven't shipped yet. SQL marks a missing value with **NULL**: not zero, not an empty string, but "unknown".

```sql
SELECT customer_id, first_name, email, city, loyalty_tier
FROM customers
WHERE customer_id BETWEEN 40 AND 50;
```

## NULL is not equal to anything

NULL isn't equal even to another NULL. Is an unknown value equal to some other unknown value? The honest answer is *unknown*, and that is what SQL returns. Comparisons can therefore have three results: **true**, **false** and **unknown** (NULL).

```sql
SELECT NULL = NULL AS equal, NULL <> 1 AS not_equal, NULL > 0 AS greater;
```

`WHERE` keeps a row only when its condition is **true**. Unknown is treated the same as false. That is why this query returns **no rows**, even though hundreds of customers have no email:

```sql
SELECT customer_id FROM customers WHERE email = NULL;
```

Use `IS NULL` and `IS NOT NULL`:

```sql
SELECT customer_id, first_name, last_name FROM customers WHERE email IS NULL;
```

## The trap: `<>` silently drops NULLs

Which customers are *not* gold-tier? The obvious query:

```sql
SELECT count(*) FROM customers WHERE loyalty_tier <> 'gold';
```

It misses every customer with no tier at all, because `NULL <> 'gold'` is unknown. If customers without a tier count as "not gold", say so:

```sql
SELECT count(*) FROM customers WHERE loyalty_tier <> 'gold' OR loyalty_tier IS NULL;
```

PostgreSQL also has a NULL-safe comparison that treats NULL as an ordinary value:

```sql
SELECT count(*) FROM customers WHERE loyalty_tier IS DISTINCT FROM 'gold';
```

(`count(*)` counts rows. Aggregates get their own module. Here it just keeps the output small.)

## Truth tables

With a third value, `AND` and `OR` follow these rules. Read them as "would knowing the unknown value change the answer?":

| a | b | a AND b | a OR b |
|---|---|---|---|
| true | NULL | NULL | **true** |
| false | NULL | **false** | NULL |
| NULL | NULL | NULL | NULL |

`NOT NULL` is NULL.

## NULL spreads

Almost any operation involving NULL gives NULL: `NULL + 1`, `'Hi ' || NULL`, `NULL * 0`. `coalesce` returns its first argument that isn't NULL, which makes it the standard way to substitute a default:

```sql
SELECT customer_id,
       city,
       'Ships to ' || city                     AS label,
       coalesce(city, 'unknown city')          AS city_or_default,
       coalesce(loyalty_tier, 'standard')      AS tier
FROM customers
WHERE customer_id IN (1, 22, 52);
```

When you design your own tables later in the course, you will decide which columns may hold NULL at all. `NOT NULL` constraints are the first line of defence against this whole category of bug.

> **Dialect note.** MySQL spells NULL-safe equality `a <=> b`, and SQL Server 2022 supports `IS [NOT] DISTINCT FROM`. `coalesce` is standard and works everywhere. You'll also see `IFNULL` (MySQL), `ISNULL` (SQL Server) and `NVL` (Oracle). Oracle stores `''` as NULL, so in Oracle `WHERE name = ''` never matches anything.
