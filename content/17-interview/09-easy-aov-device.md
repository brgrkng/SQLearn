---
title: Average order value by device
kind: problem
difficulty: easy
dataset: analytics
ordered: true
---
For each signup `device`, return the number of purchases and the **average purchase amount** rounded to 2 decimals, highest average first.

```sql solution
SELECT u.device, count(*) AS purchases, round(avg(e.amount), 2) AS avg_amount
FROM events e JOIN users u ON u.user_id = e.user_id
WHERE e.event_type = 'purchase'
GROUP BY u.device
ORDER BY avg_amount DESC;
```

```sql wrong
SELECT u.device, count(*) AS purchases, round(avg(coalesce(e.amount, 0)), 2) AS avg_amount
FROM events e JOIN users u ON u.user_id = e.user_id
GROUP BY u.device
ORDER BY avg_amount DESC;
```
