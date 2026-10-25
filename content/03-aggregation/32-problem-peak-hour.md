---
title: Peak purchase hour
kind: problem
difficulty: medium
dataset: analytics
hints:
  - "Group by `extract(hour FROM occurred_at)`."
  - "Several hours could tie for first place. `FETCH FIRST 1 ROW WITH TIES` keeps them all."
---
At which **hour of the day** (0–23) do the most purchases happen? Return the hour and the number of purchases. If several hours tie for first place, return all of them.

```sql solution
SELECT extract(hour FROM occurred_at) AS hour, count(*) AS purchases
FROM events
WHERE event_type = 'purchase'
GROUP BY hour
ORDER BY purchases DESC
FETCH FIRST 1 ROW WITH TIES;
```

```sql wrong
SELECT extract(hour FROM occurred_at) AS hour, count(*) AS purchases
FROM events
GROUP BY hour
ORDER BY purchases DESC
FETCH FIRST 1 ROW WITH TIES;
```
