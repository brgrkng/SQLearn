---
title: Right to be forgotten
kind: test
dataset: analytics
---
User **115** asked to be deleted. Remove **all of their data**: their events, their subscriptions and their `users` row. Users they referred must stay, but with `referred_by` set to NULL.

```sql solution
UPDATE users SET referred_by = NULL WHERE referred_by = 115;
DELETE FROM events WHERE user_id = 115;
DELETE FROM subscriptions WHERE user_id = 115;
DELETE FROM users WHERE user_id = 115;
```

```sql check User 115 is gone everywhere
SELECT (SELECT count(*) FROM users WHERE user_id = 115),
       (SELECT count(*) FROM events WHERE user_id = 115),
       (SELECT count(*) FROM subscriptions WHERE user_id = 115);
```

```sql check Referred users kept, with no referrer
SELECT count(*), count(referred_by) FROM users;
```

```sql check Other users' events untouched
SELECT count(*) FROM events;
```

```sql wrong
DELETE FROM events WHERE user_id = 115;
DELETE FROM subscriptions WHERE user_id = 115;
DELETE FROM users WHERE user_id = 115 OR referred_by = 115;
```
