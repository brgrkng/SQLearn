---
title: Average session length
kind: problem
difficulty: hard
dataset: analytics
ordered: true
hints:
  - Sessionize with the 30-minute rule (lag, flag, running sum).
  - A session's length is its last event time minus its first event time.
---
Using a **30-minute inactivity** rule to define sessions (ignore the `session_start` event type), compute each session's length (last event minus first event). For users **1 to 10**, return `user_id`, their number of sessions, and their **average session length** in seconds, rounded to the nearest whole second. Sort by `user_id`.

```sql solution
WITH gaps AS (
  SELECT user_id, event_id, occurred_at,
         CASE WHEN occurred_at - lag(occurred_at) OVER w > interval '30 minutes'
                   OR lag(occurred_at) OVER w IS NULL THEN 1 ELSE 0 END AS new_session
  FROM events
  WHERE user_id <= 10
  WINDOW w AS (PARTITION BY user_id ORDER BY occurred_at, event_id)
), numbered AS (
  SELECT user_id, occurred_at,
         sum(new_session) OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS session_no
  FROM gaps
), sessions AS (
  SELECT user_id, session_no, max(occurred_at) - min(occurred_at) AS length
  FROM numbered GROUP BY user_id, session_no
)
SELECT user_id, count(*) AS sessions, round(avg(extract(epoch FROM length))) AS avg_seconds
FROM sessions
GROUP BY user_id
ORDER BY user_id;
```

```sql wrong
WITH sessions AS (
  SELECT user_id, occurred_at::date AS day, max(occurred_at) - min(occurred_at) AS length
  FROM events WHERE user_id <= 10
  GROUP BY user_id, occurred_at::date
)
SELECT user_id, count(*) AS sessions, round(avg(extract(epoch FROM length))) AS avg_seconds
FROM sessions
GROUP BY user_id
ORDER BY user_id;
```
