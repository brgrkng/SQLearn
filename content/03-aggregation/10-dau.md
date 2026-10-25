---
title: Daily active users
kind: drill
dataset: analytics
ordered: true
hints:
  - "A user is active on a day if they have any event that day: `count(DISTINCT user_id)`."
  - "`occurred_at::date` turns a timestamp into its day."
---
Daily active users (**DAU**) is the number of distinct users with at least one event on a day. Return `day` and `dau` for **1–7 April 2025**, in date order.

```sql starter
SELECT occurred_at::date AS day, count(*) AS dau
FROM events
WHERE occurred_at >= '2025-04-01' AND occurred_at < '2025-04-08'
GROUP BY day
ORDER BY day;
```

```sql solution
SELECT occurred_at::date AS day, count(DISTINCT user_id) AS dau
FROM events
WHERE occurred_at >= '2025-04-01' AND occurred_at < '2025-04-08'
GROUP BY day
ORDER BY day;
```
