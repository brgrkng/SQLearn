---
title: LAG, LEAD and friends
kind: lesson
dataset: analytics
---
`lag(expr)` reads a value from the **previous** row of the window and `lead(expr)` from the **next** row. That makes "compared with last time" questions easy:

```sql
WITH monthly AS (
  SELECT date_trunc('month', occurred_at)::date AS month, sum(amount) AS revenue
  FROM events WHERE event_type = 'purchase'
  GROUP BY 1
)
SELECT month, revenue,
       lag(revenue) OVER (ORDER BY month) AS previous,
       round(100 * (revenue - lag(revenue) OVER (ORDER BY month)) / lag(revenue) OVER (ORDER BY month), 1) AS growth_pct
FROM monthly
ORDER BY month;
```

The first row has no previous row, so `lag` returns NULL. `lag(expr, n, default)` looks *n* rows back and returns `default` instead of NULL when there's no row.

## Time between events

Partition by the entity so you never compare one user's event with another user's:

```sql
SELECT user_id, occurred_at,
       occurred_at - lag(occurred_at) OVER (PARTITION BY user_id ORDER BY occurred_at) AS since_previous
FROM events
WHERE user_id = 7 AND event_type = 'session_start'
ORDER BY occurred_at;
```

`lead` gives the reverse view, "time until next". It's a common way to turn a list of *start* dates into ranges with an end date:

```sql
SELECT plan, started_on,
       lead(started_on) OVER (PARTITION BY user_id ORDER BY started_on) AS next_started_on
FROM subscriptions
WHERE user_id IN (SELECT user_id FROM subscriptions GROUP BY user_id HAVING count(*) > 1)
ORDER BY user_id, started_on
LIMIT 6;
```

## first_value, last_value, nth_value

These read a specific row of the frame:

```sql
SELECT user_id, occurred_at, event_type,
       first_value(event_type) OVER w AS first_event,
       last_value(event_type)  OVER w AS last_event_wrong,
       last_value(event_type)  OVER (w ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_event
FROM events
WHERE user_id = 7 AND occurred_at < '2025-01-20'
WINDOW w AS (PARTITION BY user_id ORDER BY occurred_at, event_id)
ORDER BY occurred_at, event_id;
```

The `last_value` gotcha: the default frame ends at the **current row**, so `last_value` returns the current row itself. To get the partition's real last value, extend the frame to `UNBOUNDED FOLLOWING` (or use `first_value` with the order reversed).

> **Dialect note.** `LAG`, `LEAD`, `FIRST_VALUE`, `LAST_VALUE` and `NTH_VALUE` are standard and widely supported (SQL Server lacks `NTH_VALUE`). Oracle and SQL Server 2022 support `IGNORE NULLS` to skip NULLs when looking back. PostgreSQL doesn't support it yet.
