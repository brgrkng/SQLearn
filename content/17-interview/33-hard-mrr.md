---
title: Monthly recurring revenue
kind: problem
difficulty: hard
dataset: analytics
ordered: true
hints:
  - "MRR at month end counts subscriptions active on the last day: `started_on <= day AND (ended_on IS NULL OR ended_on > day)`."
  - "Month ends from `generate_series`, minus one day from the first of the next month."
---
**MRR** (monthly recurring revenue) at the end of a month is the sum of `monthly_price` over subscriptions **active on the last day** of that month (started on or before it, and not ended on or before it). For each month-end of **January to June 2025**, return the date, the number of active subscriptions, the MRR, and the MRR from `pro` plans alone. In date order.

```sql solution
WITH month_ends AS (
  SELECT (m + interval '1 month' - interval '1 day')::date AS day
  FROM generate_series(date '2025-01-01', date '2025-06-01', interval '1 month') AS m
)
SELECT me.day,
       count(s.subscription_id) AS active,
       coalesce(sum(s.monthly_price), 0) AS mrr,
       coalesce(sum(s.monthly_price) FILTER (WHERE s.plan = 'pro'), 0) AS pro_mrr
FROM month_ends me
LEFT JOIN subscriptions s ON s.started_on <= me.day AND (s.ended_on IS NULL OR s.ended_on > me.day)
GROUP BY me.day
ORDER BY me.day;
```

```sql wrong
WITH month_ends AS (
  SELECT (m + interval '1 month' - interval '1 day')::date AS day
  FROM generate_series(date '2025-01-01', date '2025-06-01', interval '1 month') AS m
)
SELECT me.day,
       count(s.subscription_id) AS active,
       coalesce(sum(s.monthly_price), 0) AS mrr,
       coalesce(sum(s.monthly_price) FILTER (WHERE s.plan = 'pro'), 0) AS pro_mrr
FROM month_ends me
LEFT JOIN subscriptions s ON s.started_on <= me.day AND s.ended_on IS NULL
GROUP BY me.day
ORDER BY me.day;
```
