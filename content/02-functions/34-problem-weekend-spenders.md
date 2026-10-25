---
title: Weekend big spenders
kind: problem
difficulty: medium
dataset: analytics
hints:
  - "`to_char(ts, 'FMDay')` gives the weekday name without padding."
---
Find purchases over **$150** made on a **Saturday or Sunday** in **May 2025**. Return `event_id`, `user_id`, `amount` and the weekday name (`Saturday` or `Sunday`, with no trailing spaces).

```sql solution
SELECT event_id, user_id, amount, to_char(occurred_at, 'FMDay') AS weekday
FROM events
WHERE event_type = 'purchase' AND amount > 150
  AND occurred_at >= '2025-05-01' AND occurred_at < '2025-06-01'
  AND extract(isodow FROM occurred_at) IN (6, 7);
```

```sql wrong
SELECT event_id, user_id, amount, to_char(occurred_at, 'Day') AS weekday
FROM events
WHERE event_type = 'purchase' AND amount > 150
  AND occurred_at >= '2025-05-01' AND occurred_at < '2025-06-01'
  AND extract(isodow FROM occurred_at) IN (6, 7);
```

```sql wrong
SELECT event_id, user_id, amount, to_char(occurred_at, 'FMDay') AS weekday
FROM events
WHERE event_type = 'purchase' AND amount > 150
  AND occurred_at >= '2025-05-01' AND occurred_at < '2025-06-01'
  AND extract(dow FROM occurred_at) IN (6, 7);
```
