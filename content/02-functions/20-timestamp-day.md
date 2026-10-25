---
title: Purchases on the 15th
kind: drill
dataset: analytics
hints:
  - "`occurred_at` is a timestamp. `= '2025-03-15'` only matches midnight exactly."
---
Return `event_id`, `user_id`, `amount` and `occurred_at` for every **purchase** made on **15 March 2025**.

```sql starter
SELECT event_id, user_id, amount, occurred_at
FROM events
WHERE event_type = 'purchase' AND occurred_at = '2025-03-15';
```

```sql solution
SELECT event_id, user_id, amount, occurred_at
FROM events
WHERE event_type = 'purchase'
  AND occurred_at >= '2025-03-15' AND occurred_at < '2025-03-16';
```

```sql wrong
SELECT event_id, user_id, amount, occurred_at
FROM events
WHERE event_type = 'purchase' AND occurred_at BETWEEN '2025-03-15' AND '2025-03-15';
```
