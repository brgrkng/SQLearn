---
title: Counting sessions
kind: drill
dataset: analytics
ordered: true
hints:
  - "Gap to the previous event with `lag`, flag gaps over 30 minutes (or no previous event) as 1, then count the flags."
---
Ignore the app's own `session_start` events and define a **session** as a burst of events with no gap longer than **30 minutes**. For users **1 to 10**, return `user_id` and their number of sessions. Sort by `user_id`.

```sql solution
WITH gaps AS (
  SELECT user_id,
         occurred_at - lag(occurred_at) OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS gap
  FROM events
  WHERE user_id <= 10
)
SELECT user_id, count(*) FILTER (WHERE gap IS NULL OR gap > interval '30 minutes') AS sessions
FROM gaps
GROUP BY user_id
ORDER BY user_id;
```

```sql wrong
SELECT user_id, count(DISTINCT occurred_at::date) AS sessions
FROM events
WHERE user_id <= 10
GROUP BY user_id
ORDER BY user_id;
```

```sql wrong
WITH gaps AS (
  SELECT user_id,
         occurred_at - lag(occurred_at) OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS gap
  FROM events
  WHERE user_id <= 10
)
SELECT user_id, count(*) FILTER (WHERE gap > interval '30 minutes') AS sessions
FROM gaps
GROUP BY user_id
ORDER BY user_id;
```
