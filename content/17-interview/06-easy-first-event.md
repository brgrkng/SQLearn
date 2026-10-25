---
title: First touch
kind: problem
difficulty: easy
dataset: analytics
ordered: true
hints:
  - "`DISTINCT ON (user_id) ... ORDER BY user_id, occurred_at, event_id`, or `row_number()`."
---
For users **1 to 15**, return the `user_id`, the `page` and the `occurred_at` of their **first page view**. Sort by `user_id`.

```sql solution
SELECT DISTINCT ON (user_id) user_id, page, occurred_at
FROM events
WHERE event_type = 'page_view' AND user_id <= 15
ORDER BY user_id, occurred_at, event_id;
```

```sql wrong
SELECT DISTINCT ON (user_id) user_id, page, occurred_at
FROM events
WHERE user_id <= 15
ORDER BY user_id, occurred_at, event_id;
```

```sql wrong
SELECT user_id, min(page) AS page, min(occurred_at) AS occurred_at
FROM events
WHERE event_type = 'page_view' AND user_id <= 15
GROUP BY user_id
ORDER BY user_id;
```
