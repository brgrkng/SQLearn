---
title: Smoothed signups
kind: drill
dataset: analytics
ordered: true
hints:
  - Daily signup counts in a CTE.
  - "`avg(signups) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`"
---
For **April 2025**, return each day, its number of **signups**, and the **7-day moving average** of signups (that day and the 6 rows before it within April), rounded to 2 decimals. Every day in April had signups. In date order.

```sql solution
WITH daily AS (
  SELECT signed_up_at::date AS day, count(*) AS signups
  FROM users
  WHERE signed_up_at >= '2025-04-01' AND signed_up_at < '2025-05-01'
  GROUP BY 1
)
SELECT day, signups,
       round(avg(signups) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS moving_avg
FROM daily
ORDER BY day;
```

```sql wrong
WITH daily AS (
  SELECT signed_up_at::date AS day, count(*) AS signups
  FROM users
  WHERE signed_up_at >= '2025-04-01' AND signed_up_at < '2025-05-01'
  GROUP BY 1
)
SELECT day, signups,
       round(avg(signups) OVER (ORDER BY day ROWS BETWEEN 7 PRECEDING AND CURRENT ROW), 2) AS moving_avg
FROM daily
ORDER BY day;
```
