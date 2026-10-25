---
title: Second purchase
kind: test
dataset: analytics
ordered: true
---
For users **1 to 50** who made at least two purchases, return `user_id`, the time of their **first** purchase and the time of their **second** purchase. Sort by `user_id`.

```sql solution
WITH p AS (
  SELECT user_id, occurred_at,
         row_number() OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS n
  FROM events
  WHERE event_type = 'purchase' AND user_id <= 50
)
SELECT user_id,
       max(occurred_at) FILTER (WHERE n = 1) AS first_purchase,
       max(occurred_at) FILTER (WHERE n = 2) AS second_purchase
FROM p
GROUP BY user_id
HAVING count(*) >= 2
ORDER BY user_id;
```

```sql wrong
SELECT user_id, min(occurred_at) AS first_purchase, max(occurred_at) AS second_purchase
FROM events
WHERE event_type = 'purchase' AND user_id <= 50
GROUP BY user_id
HAVING count(*) >= 2
ORDER BY user_id;
```
