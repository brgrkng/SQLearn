---
title: Repeat-purchase share
kind: test
dataset: analytics
---
Using CTEs, compute the share of **purchasing users** who made **more than one purchase**, as a percentage rounded to 1 decimal place. Return a single number.

```sql solution
WITH per_user AS (
  SELECT user_id, count(*) AS purchases FROM events WHERE event_type = 'purchase' GROUP BY user_id
)
SELECT round(100.0 * count(*) FILTER (WHERE purchases > 1) / count(*), 1) AS repeat_pct
FROM per_user;
```

```sql wrong
WITH per_user AS (
  SELECT user_id, count(*) AS purchases FROM events WHERE event_type = 'purchase' GROUP BY user_id
)
SELECT round(100.0 * count(*) FILTER (WHERE purchases > 1) / (SELECT count(*) FROM users), 1) AS repeat_pct
FROM per_user;
```
