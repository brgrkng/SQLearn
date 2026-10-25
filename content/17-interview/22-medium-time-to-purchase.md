---
title: Time to first purchase
kind: problem
difficulty: medium
dataset: analytics
ordered: true
hints:
  - "First purchase per user: `min(occurred_at)` over purchase events."
  - "`extract(epoch FROM interval) / 3600` gives hours. The median is `percentile_cont(0.5) WITHIN GROUP (ORDER BY ...)`."
---
For users who made at least one purchase, compute the hours between signup and their **first** purchase. For each acquisition `channel` (NULL shown as `unknown`), return the number of purchasers and the **median** hours to first purchase, rounded to 1 decimal place. Sort by the median, fastest first.

```sql solution
WITH firsts AS (
  SELECT user_id, min(occurred_at) AS first_purchase FROM events WHERE event_type = 'purchase' GROUP BY user_id
)
SELECT coalesce(u.channel, 'unknown') AS channel,
       count(*) AS purchasers,
       round((percentile_cont(0.5) WITHIN GROUP (ORDER BY extract(epoch FROM f.first_purchase - u.signed_up_at) / 3600))::numeric, 1) AS median_hours
FROM firsts f JOIN users u ON u.user_id = f.user_id
GROUP BY 1
ORDER BY median_hours;
```

```sql wrong
WITH firsts AS (
  SELECT user_id, min(occurred_at) AS first_purchase FROM events WHERE event_type = 'purchase' GROUP BY user_id
)
SELECT coalesce(u.channel, 'unknown') AS channel,
       count(*) AS purchasers,
       round(avg(extract(epoch FROM f.first_purchase - u.signed_up_at) / 3600)::numeric, 1) AS median_hours
FROM firsts f JOIN users u ON u.user_id = f.user_id
GROUP BY 1
ORDER BY median_hours;
```
