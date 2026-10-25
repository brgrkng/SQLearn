---
title: Cross-border referrals
kind: test
dataset: analytics
ordered: true
---
Some users were referred by another user (`users.referred_by`). Return each referred user's `user_id` and `country`, with the referrer's `user_id` and `country`, for referrals that **crossed countries**. Sort by the referred user's `user_id`.

```sql solution
SELECT u.user_id, u.country, r.user_id AS referrer_id, r.country AS referrer_country
FROM users u
JOIN users r ON r.user_id = u.referred_by
WHERE u.country <> r.country
ORDER BY u.user_id;
```

```sql wrong
SELECT u.user_id, u.country, r.user_id AS referrer_id, r.country AS referrer_country
FROM users u
JOIN users r ON r.referred_by = u.user_id
WHERE u.country <> r.country
ORDER BY u.user_id;
```
