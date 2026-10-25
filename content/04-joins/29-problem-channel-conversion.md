---
title: Conversion by channel
kind: problem
difficulty: hard
dataset: analytics
ordered: true
hints:
  - "Start from `users` so every signup counts, and LEFT JOIN only the purchase events (condition in `ON`)."
  - "Joining events fans out. Count `DISTINCT e.user_id` for purchasers."
  - "Channel can be NULL. Show it as `unknown` with `coalesce`."
---
For each acquisition `channel` (NULL shown as **`unknown`**), return the number of **users** who signed up, the number of those users who made **at least one purchase**, and the conversion rate as a percentage rounded to 1 decimal place. Sort by conversion rate, highest first.

```sql solution
SELECT coalesce(u.channel, 'unknown') AS channel,
       count(DISTINCT u.user_id) AS users,
       count(DISTINCT e.user_id) AS purchasers,
       round(100.0 * count(DISTINCT e.user_id) / count(DISTINCT u.user_id), 1) AS conversion_pct
FROM users u
LEFT JOIN events e ON e.user_id = u.user_id AND e.event_type = 'purchase'
GROUP BY coalesce(u.channel, 'unknown')
ORDER BY conversion_pct DESC;
```

```sql wrong
SELECT coalesce(u.channel, 'unknown') AS channel,
       count(*) AS users,
       count(e.user_id) AS purchasers,
       round(100.0 * count(e.user_id) / count(*), 1) AS conversion_pct
FROM users u
LEFT JOIN events e ON e.user_id = u.user_id AND e.event_type = 'purchase'
GROUP BY coalesce(u.channel, 'unknown')
ORDER BY conversion_pct DESC;
```

```sql wrong
SELECT coalesce(u.channel, 'unknown') AS channel,
       count(DISTINCT u.user_id) AS users,
       count(DISTINCT e.user_id) AS purchasers,
       round(100.0 * count(DISTINCT e.user_id) / count(DISTINCT u.user_id), 1) AS conversion_pct
FROM users u
LEFT JOIN events e ON e.user_id = u.user_id
WHERE e.event_type = 'purchase'
GROUP BY coalesce(u.channel, 'unknown')
ORDER BY conversion_pct DESC;
```
