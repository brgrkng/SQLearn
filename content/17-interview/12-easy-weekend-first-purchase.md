---
title: Quick converters
kind: problem
difficulty: easy
dataset: analytics
ordered: true
---
Return the `user_id` of users who made a purchase within **24 hours of signing up**. Sort by `user_id`.

```sql solution
SELECT DISTINCT u.user_id
FROM users u
JOIN events e ON e.user_id = u.user_id
WHERE e.event_type = 'purchase'
  AND e.occurred_at >= u.signed_up_at AND e.occurred_at < u.signed_up_at + interval '24 hours'
ORDER BY u.user_id;
```

```sql wrong
SELECT DISTINCT u.user_id
FROM users u
JOIN events e ON e.user_id = u.user_id
WHERE e.event_type = 'purchase' AND e.occurred_at::date = u.signed_up_at::date
ORDER BY u.user_id;
```
