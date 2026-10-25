---
title: Monthly revenue
kind: drill
dataset: analytics
ordered: true
hints:
  - Only `purchase` events have an amount.
  - "`date_trunc('month', occurred_at)`"
---
Return each **month** of 2025 (as the first day of the month, a `date`) and the total purchase **revenue** in it, in order.

```sql solution
SELECT date_trunc('month', occurred_at)::date AS month, sum(amount) AS revenue
FROM events
WHERE event_type = 'purchase'
GROUP BY month
ORDER BY month;
```

```sql wrong
SELECT extract(month FROM occurred_at) AS month, sum(amount) AS revenue
FROM events
WHERE event_type = 'purchase'
GROUP BY month
ORDER BY month;
```
