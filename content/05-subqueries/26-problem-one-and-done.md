---
title: The quiet week
kind: problem
difficulty: medium
dataset: analytics
ordered: true
hints:
  - "Day 1 after signup starts at `signed_up_at::date + 1`, and day 7 ends before `signed_up_at::date + 8`."
  - "`NOT EXISTS` an event in that window."
---
Return the `user_id` and `signed_up_at` of users who signed up in **March 2025** and had **no activity at all on any of the 7 days after their signup day** (days 1 to 7 after signup, by calendar day). Sort by `user_id`.

```sql solution
SELECT u.user_id, u.signed_up_at
FROM users u
WHERE u.signed_up_at >= '2025-03-01' AND u.signed_up_at < '2025-04-01'
  AND NOT EXISTS (SELECT 1 FROM events e
                  WHERE e.user_id = u.user_id
                    AND e.occurred_at >= u.signed_up_at::date + 1
                    AND e.occurred_at <  u.signed_up_at::date + 8)
ORDER BY u.user_id;
```

```sql wrong
SELECT u.user_id, u.signed_up_at
FROM users u
WHERE u.signed_up_at >= '2025-03-01' AND u.signed_up_at < '2025-04-01'
  AND NOT EXISTS (SELECT 1 FROM events e
                  WHERE e.user_id = u.user_id
                    AND e.occurred_at > u.signed_up_at
                    AND e.occurred_at < u.signed_up_at + interval '7 days')
ORDER BY u.user_id;
```
