---
title: Longest streak
kind: drill
dataset: analytics
ordered: true
hints:
  - Distinct active days per user, then `day - row_number() OVER (PARTITION BY user_id ORDER BY day)` identifies each streak.
  - Count days per (user, streak), then take each user's maximum.
---
For users **1 to 20**, return `user_id` and the length of their **longest run of consecutive active days** (days with at least one event). Sort by `user_id`.

```sql solution
WITH days AS (
  SELECT DISTINCT user_id, occurred_at::date AS day FROM events WHERE user_id <= 20
), islands AS (
  SELECT user_id, day - row_number() OVER (PARTITION BY user_id ORDER BY day)::int AS island FROM days
), streaks AS (
  SELECT user_id, count(*) AS length FROM islands GROUP BY user_id, island
)
SELECT user_id, max(length) AS longest_streak FROM streaks GROUP BY user_id ORDER BY user_id;
```

```sql wrong
SELECT user_id, count(DISTINCT occurred_at::date) AS longest_streak
FROM events
WHERE user_id <= 20
GROUP BY user_id
ORDER BY user_id;
```
