---
title: Referral leaderboard
kind: problem
difficulty: hard
dataset: analytics
ordered: true
hints:
  - "Anchor on every referral pair (referrer, referred), then keep walking down while carrying the original referrer."
---
Rank users by their **total downstream referrals**: everyone they referred directly, plus everyone those users referred, and so on. Return the top **5** users with `user_id`, direct referrals and total downstream referrals. Most total first, then most direct, then `user_id`.

```sql solution
WITH RECURSIVE downstream AS (
  SELECT referred_by AS root, user_id FROM users WHERE referred_by IS NOT NULL
  UNION ALL
  SELECT d.root, u.user_id FROM users u JOIN downstream d ON u.referred_by = d.user_id
),
totals AS (
  SELECT root, count(*) AS total FROM downstream GROUP BY root
),
directs AS (
  SELECT referred_by, count(*) AS direct FROM users WHERE referred_by IS NOT NULL GROUP BY referred_by
)
SELECT t.root AS user_id, d.direct, t.total
FROM totals t JOIN directs d ON d.referred_by = t.root
ORDER BY t.total DESC, d.direct DESC, t.root
LIMIT 5;
```

```sql wrong
SELECT referred_by AS user_id, count(*) AS direct, count(*) AS total
FROM users
WHERE referred_by IS NOT NULL
GROUP BY referred_by
ORDER BY total DESC, direct DESC, user_id
LIMIT 5;
```
