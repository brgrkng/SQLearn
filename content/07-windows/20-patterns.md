---
title: "Patterns: gaps and islands, sessions"
kind: lesson
dataset: analytics
---
Two window-function patterns solve a surprising number of real problems and interview questions.

## Gaps and islands: finding streaks

"What is each user's longest run of consecutive active days?" Each run of consecutive days is an **island**. The trick: number the days in order and subtract that number from the date. Within an island, date and number go up together, so the difference stays **constant**. A gap changes it.

```sql
WITH days AS (
  SELECT DISTINCT user_id, occurred_at::date AS day FROM events WHERE user_id = 7
),
grouped AS (
  SELECT user_id, day,
         day - row_number() OVER (PARTITION BY user_id ORDER BY day)::int AS island
  FROM days
)
SELECT user_id, min(day) AS streak_start, max(day) AS streak_end, count(*) AS length
FROM grouped
GROUP BY user_id, island
ORDER BY streak_start;
```

Look at the `island` column if you're curious. It's an arbitrary date that is shared by every day of one streak. Group by it and you have the streaks. The same idea finds consecutive IDs, unbroken subscription months, or runs of the same status.

## Sessionization: grouping events by inactivity

Analytics tools define a **session** as a burst of activity: a new session starts when a user has been inactive for more than, say, 30 minutes. In SQL:

1. Use `lag` to get the time since the user's previous event.
2. Flag an event as a **session start** if there was no previous event or the gap is longer than 30 minutes.
3. A **running sum** of the flags numbers the sessions.

```sql
WITH gaps AS (
  SELECT user_id, event_id, occurred_at,
         occurred_at - lag(occurred_at) OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS gap
  FROM events
  WHERE user_id = 7 AND occurred_at < '2025-01-25'
),
flagged AS (
  SELECT *, CASE WHEN gap IS NULL OR gap > interval '30 minutes' THEN 1 ELSE 0 END AS new_session
  FROM gaps
)
SELECT user_id, event_id, occurred_at, gap,
       sum(new_session) OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS session_no
FROM flagged
ORDER BY occurred_at, event_id;
```

This "flag the boundaries, then take a running sum" technique is the general way to cut an ordered stream into groups, whatever the boundary rule is.

## Comparing with the best so far

A running `max` answers questions like "did this month set a new record?":

```sql
WITH monthly AS (
  SELECT date_trunc('month', signed_up_at)::date AS month, count(*) AS signups
  FROM users GROUP BY 1
)
SELECT month, signups,
       signups = max(signups) OVER (ORDER BY month) AS record
FROM monthly
ORDER BY month;
```

> **Dialect note.** These patterns work anywhere window functions do. Some warehouses (Snowflake, Oracle) add `MATCH_RECOGNIZE` for pattern matching across rows. It's powerful, but rarely needed once you know these tricks.
