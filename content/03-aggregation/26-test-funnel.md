---
title: May funnel
kind: test
dataset: analytics
ordered: true
---
For **May 2025**, return each `event_type` and the number of **distinct users** who triggered it, most users first.

```sql solution
SELECT event_type, count(DISTINCT user_id) AS users
FROM events
WHERE occurred_at >= '2025-05-01' AND occurred_at < '2025-06-01'
GROUP BY event_type
ORDER BY users DESC;
```

```sql wrong
SELECT event_type, count(*) AS users
FROM events
WHERE occurred_at >= '2025-05-01' AND occurred_at < '2025-06-01'
GROUP BY event_type
ORDER BY users DESC;
```
