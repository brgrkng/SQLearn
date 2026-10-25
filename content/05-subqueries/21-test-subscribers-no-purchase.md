---
title: Subscribers who never bought
kind: test
dataset: analytics
ordered: true
---
Return the `user_id` of users who have **ever had a subscription** but have **never made a purchase** event, sorted.

```sql solution
SELECT user_id FROM subscriptions
EXCEPT
SELECT user_id FROM events WHERE event_type = 'purchase'
ORDER BY user_id;
```

```sql wrong
SELECT user_id FROM subscriptions
EXCEPT
SELECT user_id FROM events
ORDER BY user_id;
```
