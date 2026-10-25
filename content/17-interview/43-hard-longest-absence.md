---
title: The longest absence
kind: problem
difficulty: hard
dataset: analytics
ordered: true
hints:
  - Distinct active days per user, then `day - lag(day)` is the gap since the previous active day.
  - "Keep each user's largest gap, with the day they came back."
---
For users who signed up in **January 2025**, find their **longest gap between active days** (days with any event), measured in days between consecutive active days. Return the **10** users with the longest gaps: `user_id`, the gap in days, and the date they **returned** (the active day ending the gap). Longest first; ties broken by the earlier return date, then `user_id`. If a user has several gaps of their maximum length, use the earliest.

```sql solution
WITH days AS (
  SELECT DISTINCT e.user_id, e.occurred_at::date AS day
  FROM events e JOIN users u ON u.user_id = e.user_id
  WHERE u.signed_up_at >= '2025-01-01' AND u.signed_up_at < '2025-02-01'
), gaps AS (
  SELECT user_id, day, day - lag(day) OVER (PARTITION BY user_id ORDER BY day) AS gap FROM days
), best AS (
  SELECT DISTINCT ON (user_id) user_id, gap, day AS returned_on
  FROM gaps WHERE gap IS NOT NULL
  ORDER BY user_id, gap DESC, day
)
SELECT user_id, gap, returned_on FROM best
ORDER BY gap DESC, returned_on, user_id
LIMIT 10;
```

```sql wrong
WITH days AS (
  SELECT DISTINCT e.user_id, e.occurred_at::date AS day
  FROM events e JOIN users u ON u.user_id = e.user_id
  WHERE u.signed_up_at >= '2025-01-01' AND u.signed_up_at < '2025-02-01'
)
SELECT user_id, max(day) - min(day) AS gap, max(day) AS returned_on
FROM days
GROUP BY user_id
ORDER BY gap DESC, returned_on, user_id
LIMIT 10;
```
