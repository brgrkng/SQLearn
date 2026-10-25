---
title: Seven days straight
kind: problem
difficulty: medium
dataset: analytics
ordered: true
hints:
  - Distinct active days per user, then gaps and islands.
---
Return the `user_id` and the start date of the **first** run of at least **7 consecutive active days** (days with any event) for every user who has one. Sort by `user_id`.

```sql solution
WITH days AS (
  SELECT DISTINCT user_id, occurred_at::date AS day FROM events
), islands AS (
  SELECT user_id, day, day - row_number() OVER (PARTITION BY user_id ORDER BY day)::int AS grp FROM days
), streaks AS (
  SELECT user_id, min(day) AS start_day, count(*) AS len FROM islands GROUP BY user_id, grp
)
SELECT user_id, min(start_day) AS first_streak_start
FROM streaks
WHERE len >= 7
GROUP BY user_id
ORDER BY user_id;
```

```sql wrong
WITH days AS (
  SELECT DISTINCT user_id, occurred_at::date AS day FROM events
)
SELECT user_id, min(day) AS first_streak_start
FROM days
GROUP BY user_id
HAVING count(*) >= 7
ORDER BY user_id;
```
