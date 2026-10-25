---
title: Current plan per user
kind: drill
dataset: analytics
ordered: true
hints:
  - Number each user's subscriptions newest first, then keep the first.
---
Some users changed plans and have several subscription rows. For users **1 to 300**, return each subscriber's **most recent subscription**: `user_id`, `plan` and `started_on`. Sort by `user_id`.

```sql solution
WITH ranked AS (
  SELECT user_id, plan, started_on,
         row_number() OVER (PARTITION BY user_id ORDER BY started_on DESC, subscription_id DESC) AS rn
  FROM subscriptions
  WHERE user_id <= 300
)
SELECT user_id, plan, started_on FROM ranked WHERE rn = 1 ORDER BY user_id;
```

```sql wrong
WITH ranked AS (
  SELECT user_id, plan, started_on,
         row_number() OVER (PARTITION BY user_id ORDER BY started_on, subscription_id) AS rn
  FROM subscriptions
  WHERE user_id <= 300
)
SELECT user_id, plan, started_on FROM ranked WHERE rn = 1 ORDER BY user_id;
```
