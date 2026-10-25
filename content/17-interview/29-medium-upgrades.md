---
title: Plan upgrades
kind: problem
difficulty: medium
dataset: analytics
ordered: true
hints:
  - "Order each user's subscriptions by `started_on` and compare each with the previous one using `lag(plan)`."
  - "Rank the plans: basic < pro < team."
---
A user **upgraded** when a subscription's plan ranks higher than their previous subscription's plan (basic < pro < team). Return the `user_id`, the previous plan, the new plan and the new subscription's `started_on` for every upgrade. Sort by `user_id`, then `started_on`.

```sql solution
WITH seq AS (
  SELECT user_id, plan, started_on,
         lag(plan) OVER (PARTITION BY user_id ORDER BY started_on, subscription_id) AS previous_plan
  FROM subscriptions
)
SELECT user_id, previous_plan, plan, started_on
FROM seq
WHERE array_position(ARRAY['basic', 'pro', 'team'], plan) > array_position(ARRAY['basic', 'pro', 'team'], previous_plan)
ORDER BY user_id, started_on;
```

```sql wrong
WITH seq AS (
  SELECT user_id, plan, started_on,
         lag(plan) OVER (PARTITION BY user_id ORDER BY started_on, subscription_id) AS previous_plan
  FROM subscriptions
)
SELECT user_id, previous_plan, plan, started_on
FROM seq
WHERE plan <> previous_plan
ORDER BY user_id, started_on;
```
