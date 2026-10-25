---
title: Monthly churn
kind: problem
difficulty: medium
dataset: analytics
ordered: true
hints:
  - "Active at the start of a month: `started_on < month AND (ended_on IS NULL OR ended_on >= month)`."
  - Ended during the month means `ended_on` falls within it.
  - A calendar of months from `generate_series` keeps the logic simple.
---
For each month from **February to June 2025** (first day, as a `date`), return the number of subscriptions **active at the start** of the month, the number that **ended during** the month, and the churn rate (ended ÷ active at start) as a percentage rounded to 1 decimal place. In month order.

```sql solution
WITH months AS (
  SELECT m::date AS month FROM generate_series(date '2025-02-01', date '2025-06-01', interval '1 month') m
)
SELECT m.month,
       count(*) FILTER (WHERE s.started_on < m.month AND (s.ended_on IS NULL OR s.ended_on >= m.month)) AS active_at_start,
       count(*) FILTER (WHERE s.ended_on >= m.month AND s.ended_on < (m.month + interval '1 month')::date) AS ended,
       round(100.0 * count(*) FILTER (WHERE s.ended_on >= m.month AND s.ended_on < (m.month + interval '1 month')::date)
             / count(*) FILTER (WHERE s.started_on < m.month AND (s.ended_on IS NULL OR s.ended_on >= m.month)), 1) AS churn_pct
FROM months m CROSS JOIN subscriptions s
GROUP BY m.month
ORDER BY m.month;
```

```sql wrong
WITH months AS (
  SELECT m::date AS month FROM generate_series(date '2025-02-01', date '2025-06-01', interval '1 month') m
)
SELECT m.month,
       count(*) FILTER (WHERE s.started_on < m.month) AS active_at_start,
       count(*) FILTER (WHERE s.ended_on >= m.month AND s.ended_on < (m.month + interval '1 month')::date) AS ended,
       round(100.0 * count(*) FILTER (WHERE s.ended_on >= m.month AND s.ended_on < (m.month + interval '1 month')::date)
             / count(*) FILTER (WHERE s.started_on < m.month), 1) AS churn_pct
FROM months m CROSS JOIN subscriptions s
GROUP BY m.month
ORDER BY m.month;
```
