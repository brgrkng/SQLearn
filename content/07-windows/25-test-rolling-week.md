---
title: Rolling weekly revenue
kind: test
dataset: analytics
ordered: true
---
For **June 2025**, return each day (as a `date`), its purchase revenue, and the **rolling 7-day revenue**: that day plus the 6 preceding **calendar days**, even if some of them had no purchases. Only include days that had purchases. In date order.

```sql solution
WITH daily AS (
  SELECT occurred_at::date AS day, sum(amount) AS revenue
  FROM events
  WHERE event_type = 'purchase' AND occurred_at >= '2025-05-25' AND occurred_at < '2025-07-01'
  GROUP BY 1
), rolled AS (
  SELECT day, revenue,
         sum(revenue) OVER (ORDER BY day RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW) AS rolling_7d
  FROM daily
)
SELECT day, revenue, rolling_7d FROM rolled WHERE day >= '2025-06-01' ORDER BY day;
```

```sql wrong
WITH daily AS (
  SELECT occurred_at::date AS day, sum(amount) AS revenue
  FROM events
  WHERE event_type = 'purchase' AND occurred_at >= '2025-06-01' AND occurred_at < '2025-07-01'
  GROUP BY 1
)
SELECT day, revenue,
       sum(revenue) OVER (ORDER BY day RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW) AS rolling_7d
FROM daily
ORDER BY day;
```

## Explanation
The window can only see rows that survive the `WHERE` clause. To include the last days of May in June 1st's 7-day window, the CTE has to fetch them, and the final query then filters down to June. Filtering to June first gives early-June days a truncated window.
