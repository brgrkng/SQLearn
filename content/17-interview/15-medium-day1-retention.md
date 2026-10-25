---
title: Day-1 retention by signup month
kind: problem
difficulty: medium
dataset: analytics
ordered: true
hints:
  - "A user is retained on day 1 if they have any event on `signed_up_at::date + 1`."
  - "Build distinct (user, active day) pairs once, then LEFT JOIN users to them on the day after signup. A correlated subquery per user would scan all events 2,000 times."
---
**Day-1 retention** is the share of users who were active on the calendar day **after** their signup day. For each signup month (first day, as a `date`), return the number of signups and the day-1 retention as a percentage rounded to 1 decimal place, in month order.

```sql solution
WITH active AS (
  SELECT DISTINCT user_id, occurred_at::date AS day FROM events
)
SELECT date_trunc('month', u.signed_up_at)::date AS month,
       count(*) AS signups,
       round(100.0 * count(a.user_id) / count(*), 1) AS day1_retention
FROM users u
LEFT JOIN active a ON a.user_id = u.user_id AND a.day = u.signed_up_at::date + 1
GROUP BY 1
ORDER BY 1;
```

```sql wrong
WITH active AS (
  SELECT DISTINCT user_id, occurred_at::date AS day FROM events
)
SELECT date_trunc('month', u.signed_up_at)::date AS month,
       count(*) AS signups,
       round(100.0 * count(a.user_id) / count(*), 1) AS day1_retention
FROM users u
LEFT JOIN active a ON a.user_id = u.user_id AND a.day = u.signed_up_at::date
GROUP BY 1
ORDER BY 1;
```

```sql wrong
WITH active AS (
  SELECT DISTINCT user_id, occurred_at::date AS day FROM events
)
SELECT date_trunc('month', u.signed_up_at)::date AS month,
       count(*) AS signups,
       round(100.0 * count(a.user_id) / count(*), 1) AS day1_retention
FROM users u
JOIN active a ON a.user_id = u.user_id AND a.day = u.signed_up_at::date + 1
GROUP BY 1
ORDER BY 1;
```
