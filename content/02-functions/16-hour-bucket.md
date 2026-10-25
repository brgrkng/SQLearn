---
title: Purchases by hour
kind: drill
dataset: analytics
hints:
  - "`date_trunc('hour', ts)` rounds a timestamp down to the start of its hour."
---
For every **purchase** event on **10 April 2025**, return `event_id`, `amount`, and the **start of the hour** it happened in (e.g. `2025-04-10 14:00:00`).

```sql starter
SELECT event_id, amount, occurred_at
FROM events
WHERE event_type = 'purchase';
```

```sql solution
SELECT event_id, amount, date_trunc('hour', occurred_at) AS hour
FROM events
WHERE event_type = 'purchase'
  AND occurred_at >= '2025-04-10' AND occurred_at < '2025-04-11';
```

```sql wrong
SELECT event_id, amount, extract(hour FROM occurred_at) AS hour
FROM events
WHERE event_type = 'purchase'
  AND occurred_at >= '2025-04-10' AND occurred_at < '2025-04-11';
```
