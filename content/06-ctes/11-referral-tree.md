---
title: A referral tree
kind: drill
dataset: analytics
ordered: true
hints:
  - "`users.referred_by` points at the referrer. Walk down from user 25."
---
User **25** referred some friends, who referred friends of their own. Return every user in user 25's referral tree (**excluding** user 25), with `user_id` and the **generation** (1 for users referred directly by 25, 2 for their referrals, and so on). Sort by generation, then `user_id`.

```sql solution
WITH RECURSIVE tree AS (
  SELECT user_id, 0 AS generation FROM users WHERE user_id = 25
  UNION ALL
  SELECT u.user_id, t.generation + 1 FROM users u JOIN tree t ON u.referred_by = t.user_id
)
SELECT user_id, generation FROM tree WHERE generation > 0 ORDER BY generation, user_id;
```

```sql wrong
SELECT user_id, 1 AS generation FROM users WHERE referred_by = 25 ORDER BY user_id;
```
