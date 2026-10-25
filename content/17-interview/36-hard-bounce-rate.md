---
title: Bounce rate
kind: problem
difficulty: hard
dataset: analytics
ordered: true
hints:
  - Sessionize page views with the 30-minute rule (lag, flag, running sum).
  - A session *bounces* if it has exactly one page view.
---
Using **only `page_view` events**, split each user's views into sessions (a new session starts after more than **30 minutes** without a page view). A session **bounces** if it contains exactly **one** page view. For each `device` (from `users`), return the number of sessions and the bounce rate as a percentage rounded to 1 decimal place. Sort by bounce rate, highest first.

```sql solution
WITH views AS (
  SELECT user_id, event_id, occurred_at,
         CASE WHEN occurred_at - lag(occurred_at) OVER w > interval '30 minutes' OR lag(occurred_at) OVER w IS NULL
              THEN 1 ELSE 0 END AS new_session
  FROM events
  WHERE event_type = 'page_view'
  WINDOW w AS (PARTITION BY user_id ORDER BY occurred_at, event_id)
), numbered AS (
  SELECT user_id, sum(new_session) OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS session_no
  FROM views
), sessions AS (
  SELECT user_id, session_no, count(*) AS page_views FROM numbered GROUP BY user_id, session_no
)
SELECT u.device, count(*) AS sessions,
       round(100.0 * count(*) FILTER (WHERE s.page_views = 1) / count(*), 1) AS bounce_pct
FROM sessions s JOIN users u ON u.user_id = s.user_id
GROUP BY u.device
ORDER BY bounce_pct DESC;
```

```sql wrong
WITH sessions AS (
  SELECT user_id, occurred_at::date AS day, count(*) AS page_views
  FROM events WHERE event_type = 'page_view'
  GROUP BY user_id, occurred_at::date
)
SELECT u.device, count(*) AS sessions,
       round(100.0 * count(*) FILTER (WHERE s.page_views = 1) / count(*), 1) AS bounce_pct
FROM sessions s JOIN users u ON u.user_id = s.user_id
GROUP BY u.device
ORDER BY bounce_pct DESC;
```
