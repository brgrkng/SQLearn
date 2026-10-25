---
title: Loyal buyers
kind: problem
difficulty: easy
dataset: analytics
ordered: true
---
Return the `user_id` and number of purchases of users with **more than 4 purchases**, most purchases first, ties broken by `user_id`.

```sql solution
SELECT user_id, count(*) AS purchases
FROM events
WHERE event_type = 'purchase'
GROUP BY user_id
HAVING count(*) > 4
ORDER BY purchases DESC, user_id;
```

```sql wrong
SELECT user_id, count(*) AS purchases
FROM events
GROUP BY user_id
HAVING count(*) FILTER (WHERE event_type = 'purchase') > 4
ORDER BY purchases DESC, user_id;
```
