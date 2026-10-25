---
title: Cohort retention matrix
kind: problem
difficulty: hard
dataset: analytics
ordered: true
hints:
  - "A user's cohort is their signup month. Their *month offset* for an event is the number of whole calendar months between the signup month and the event's month."
  - "`(extract(year FROM age(event_month, cohort)) * 12 + extract(month FROM age(event_month, cohort)))::int` gives that offset."
  - Count distinct users per (cohort, offset), and divide by the cohort size.
---
Build a **monthly cohort retention table**. For each signup month (`cohort`, first day as a `date`) and each **month offset** 0, 1, 2, … (0 = the signup month itself), return the cohort size, the number of the cohort's users active in that month, and the retention percentage (active ÷ cohort size, rounded to 1 decimal place). Only include offsets with at least one active user. Sort by cohort, then offset.

```sql solution
WITH cohorts AS (
  SELECT user_id, date_trunc('month', signed_up_at)::date AS cohort FROM users
),
sizes AS (
  SELECT cohort, count(*) AS cohort_size FROM cohorts GROUP BY cohort
),
activity AS (
  SELECT DISTINCT e.user_id, c.cohort, date_trunc('month', e.occurred_at)::date AS active_month
  FROM events e JOIN cohorts c ON c.user_id = e.user_id
)
SELECT a.cohort,
       (extract(year FROM age(a.active_month, a.cohort)) * 12 + extract(month FROM age(a.active_month, a.cohort)))::int AS month_offset,
       s.cohort_size,
       count(*) AS active_users,
       round(100.0 * count(*) / s.cohort_size, 1) AS retention_pct
FROM activity a JOIN sizes s ON s.cohort = a.cohort
GROUP BY a.cohort, month_offset, s.cohort_size
ORDER BY a.cohort, month_offset;
```

```sql wrong
WITH cohorts AS (
  SELECT user_id, date_trunc('month', signed_up_at)::date AS cohort FROM users
),
sizes AS (
  SELECT cohort, count(*) AS cohort_size FROM cohorts GROUP BY cohort
),
activity AS (
  SELECT e.user_id, c.cohort, date_trunc('month', e.occurred_at)::date AS active_month
  FROM events e JOIN cohorts c ON c.user_id = e.user_id
)
SELECT a.cohort,
       (extract(year FROM age(a.active_month, a.cohort)) * 12 + extract(month FROM age(a.active_month, a.cohort)))::int AS month_offset,
       s.cohort_size,
       count(*) AS active_users,
       round(100.0 * count(*) / s.cohort_size, 1) AS retention_pct
FROM activity a JOIN sizes s ON s.cohort = a.cohort
GROUP BY a.cohort, month_offset, s.cohort_size
ORDER BY a.cohort, month_offset;
```
