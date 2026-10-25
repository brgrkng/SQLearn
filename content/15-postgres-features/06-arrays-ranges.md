---
title: Arrays and range types
kind: lesson
dataset: empty
cumulative: true
---
## Arrays

Any type can be an array: `text[]`, `int[]`, `date[]`.

```sql
CREATE TABLE articles (article_id int PRIMARY KEY, title text NOT NULL, tags text[] NOT NULL DEFAULT '{}');
INSERT INTO articles VALUES
  (1, 'Intro to SQL', ARRAY['sql', 'beginner']),
  (2, 'Window functions', '{sql,analytics,advanced}'),
  (3, 'Indexing in depth', '{performance,advanced}');
SELECT * FROM articles;
```

```sql
SELECT title FROM articles WHERE 'advanced' = ANY (tags);              -- contains one value
SELECT title FROM articles WHERE tags @> ARRAY['sql', 'advanced'];     -- contains all of these
SELECT title FROM articles WHERE tags && ARRAY['beginner', 'performance']; -- overlaps any of these
```

```sql
SELECT tag, count(*) FROM articles, unnest(tags) AS tag GROUP BY tag ORDER BY count(*) DESC, tag;
```

`unnest` turns an array into rows and `array_agg` turns rows into an array. `cardinality(tags)` is the number of elements, `array_to_string(tags, ', ')` joins them, and `tags[1]` is the first element (arrays are 1-based). A GIN index speeds up `@>`, `&&` and `= ANY`.

Arrays suit small, simple lists that belong to one row and are read with it, such as tags or an ordered list of ids. You can't put foreign keys on array elements, so for real relationships use a junction table (Module 11).

## Range types

A **range** is an interval of values in one column: `int4range`, `numrange`, `daterange`, `tsrange` and `tstzrange`. Bounds are written `[` (inclusive) or `(` (exclusive). The usual convention is `[start, end)`, which includes the start and excludes the end, so adjacent ranges don't overlap:

```sql
CREATE TABLE promotions (promo text PRIMARY KEY, valid daterange NOT NULL);
INSERT INTO promotions VALUES
  ('NEWYEAR', '[2026-01-01, 2026-01-08)'),
  ('WINTER',  '[2026-01-01, 2026-03-01)'),
  ('SPRING',  '[2026-03-01, 2026-06-01)');

SELECT promo FROM promotions WHERE valid @> date '2026-02-14';                    -- contains a point
SELECT promo FROM promotions WHERE valid && daterange('2026-02-25', '2026-03-05'); -- overlaps a range
```

```sql
SELECT promo, lower(valid) AS starts, upper(valid) AS ends_before, upper(valid) - lower(valid) AS days
FROM promotions ORDER BY lower(valid), promo;
```

Other useful operators: `-|-` (adjacent), `*` (intersection), `<<` / `>>` (strictly before/after), and `isempty`. **Multiranges** (PostgreSQL 14+) hold several disjoint ranges. `range_agg(valid)` merges a set of ranges into one:

```sql
SELECT range_agg(valid) FROM promotions;
```

Ranges are the natural model for bookings, validity periods, price bands and shifts. Combined with a GiST **exclusion constraint** (Module 10), the database itself guarantees no overlaps.

> **Dialect note.** Arrays and range types are PostgreSQL-specific. Other databases model lists with junction tables or JSON, and ranges as two columns (`start_at`, `end_at`) with the overlap test written out as `a.start < b.end AND b.start < a.end`. That's worth memorising, because it's the portable overlap formula.
