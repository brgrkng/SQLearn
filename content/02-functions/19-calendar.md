---
title: Every day in February
kind: drill
ordered: true
hints:
  - "`generate_series(start, stop, interval '1 day')`, cast to `date`."
  - 2024 was a leap year.
---
Return one row per day of **February 2024**, in order, as a `date` column.

```sql starter
SELECT generate_series(date '2024-02-01', date '2024-02-28', interval '1 day')::date AS day;
```

```sql solution
SELECT d::date AS day
FROM generate_series(date '2024-02-01', date '2024-02-29', interval '1 day') AS d;
```

```sql wrong
SELECT d::date AS day
FROM generate_series(date '2024-02-01', date '2024-03-01', interval '1 day') AS d;
```
