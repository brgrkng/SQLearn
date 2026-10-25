---
title: Above-average months
kind: drill
dataset: analytics
ordered: true
hints:
  - "First CTE: purchase revenue per month. Second step: keep months whose revenue beats the average month."
---
Return the months (first day, as a `date`) whose **purchase revenue** was **above the average monthly revenue** for 2025, with that revenue, in month order.

```sql solution
WITH monthly AS (
  SELECT date_trunc('month', occurred_at)::date AS month, sum(amount) AS revenue
  FROM events
  WHERE event_type = 'purchase'
  GROUP BY 1
)
SELECT month, revenue
FROM monthly
WHERE revenue > (SELECT avg(revenue) FROM monthly)
ORDER BY month;
```

```sql wrong
WITH monthly AS (
  SELECT date_trunc('month', occurred_at)::date AS month, sum(amount) AS revenue
  FROM events
  WHERE event_type = 'purchase'
  GROUP BY 1
)
SELECT month, revenue
FROM monthly
WHERE revenue > (SELECT avg(amount) FROM events WHERE event_type = 'purchase')
ORDER BY month;
```
