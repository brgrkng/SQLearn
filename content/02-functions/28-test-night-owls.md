---
title: Night owls
kind: test
dataset: analytics
---
Find sessions that started between **midnight and 04:59** on **20 May 2025**. Return `event_id`, `user_id`, and the start time formatted as `HH24:MI` (e.g. `03:07`).

```sql solution
SELECT event_id, user_id, to_char(occurred_at, 'HH24:MI') AS started
FROM events
WHERE event_type = 'session_start'
  AND occurred_at >= '2025-05-20 00:00' AND occurred_at < '2025-05-20 05:00';
```

```sql wrong
SELECT event_id, user_id, to_char(occurred_at, 'HH:MI') AS started
FROM events
WHERE event_type = 'session_start'
  AND occurred_at >= '2025-05-20 00:00' AND occurred_at < '2025-05-20 05:00';
```

```sql wrong
SELECT event_id, user_id, to_char(occurred_at, 'HH24:MI') AS started
FROM events
WHERE occurred_at >= '2025-05-20 00:00' AND occurred_at < '2025-05-20 05:00';
```
