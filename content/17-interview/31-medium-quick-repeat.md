---
title: Came back within a week
kind: problem
difficulty: medium
dataset: analytics
hints:
  - "`lead(occurred_at)` over each user's purchases gives the next purchase time."
---
What percentage of **purchasers** made a **second purchase within 7 days** of their first one? Return a single number rounded to 1 decimal place.

```sql solution
WITH p AS (
  SELECT user_id, occurred_at,
         row_number() OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS n,
         lead(occurred_at) OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS next_at
  FROM events
  WHERE event_type = 'purchase'
)
SELECT round(100.0 * count(*) FILTER (WHERE next_at <= occurred_at + interval '7 days') / count(*), 1) AS pct
FROM p
WHERE n = 1;
```

```sql wrong
WITH p AS (
  SELECT user_id, occurred_at,
         lead(occurred_at) OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS next_at
  FROM events
  WHERE event_type = 'purchase'
)
SELECT round(100.0 * count(*) FILTER (WHERE next_at <= occurred_at + interval '7 days') / count(*), 1) AS pct
FROM p;
```
