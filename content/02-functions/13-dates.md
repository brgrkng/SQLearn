---
title: Dates, times and intervals
kind: lesson
dataset: analytics
---
## The types

| Type | Example | Use for |
|---|---|---|
| `date` | `2025-03-15` | Calendar days: birthdays, order dates |
| `timestamp` | `2025-03-15 14:30:00` | A wall-clock moment with no time zone |
| `timestamptz` | `2025-03-15 14:30:00+00` | An absolute instant. Stored as UTC, shown in the session's zone |
| `interval` | `3 days 04:00:00` | A duration |
| `time` | `14:30:00` | A time of day |

The analytics dataset stores `users.signed_up_at` and `events.occurred_at` as `timestamp`.

## Arithmetic

```sql
SELECT date '2025-03-31' - date '2025-03-01'           AS days_between,      -- integer
       date '2025-03-01' + 30                          AS plus_30_days,      -- date
       date '2025-01-31' + interval '1 month'          AS plus_a_month,      -- timestamp
       timestamp '2025-03-15 18:00' - timestamp '2025-03-15 09:30' AS worked,  -- interval
       interval '90 minutes' * 3                       AS longer;
```

Subtracting dates gives a whole number of days. Subtracting timestamps gives an `interval`. Adding `'1 month'` to January 31 gives February 28: PostgreSQL clamps to the last day of the month instead of overflowing.

## Taking dates apart

`extract(field FROM value)` pulls out one field. `date_trunc(unit, value)` rounds *down* to the start of a unit, which is the standard way to bucket timestamps by hour, day, week or month:

```sql
SELECT occurred_at,
       extract(year FROM occurred_at)   AS year,
       extract(isodow FROM occurred_at) AS weekday,   -- 1 = Monday … 7 = Sunday
       extract(hour FROM occurred_at)   AS hour,
       date_trunc('week', occurred_at)  AS week_start,
       date_trunc('month', occurred_at) AS month_start,
       occurred_at::date                AS day
FROM events
WHERE event_id <= 5;
```

`extract(epoch FROM interval)` converts a duration to seconds, which is useful for averages and comparisons.

## Formatting

`to_char(value, pattern)` turns a date into text. Common pattern pieces: `YYYY`, `MM`, `Mon`, `Month`, `DD`, `Dy`, `Day`, `HH24`, `MI`, `SS`. `FM` removes padding:

```sql
SELECT to_char(timestamp '2025-03-05 14:07:09', 'YYYY-MM-DD HH24:MI') AS iso,
       to_char(timestamp '2025-03-05 14:07:09', 'Dy DD Mon YYYY')     AS friendly,
       to_char(timestamp '2025-03-05 14:07:09', 'FMMonth FMDDth')     AS fancy;
```

`to_date('05/03/2025', 'DD/MM/YYYY')` and `to_timestamp(...)` parse text in a known layout.

## Ranges over timestamps

Half-open ranges matter even more with timestamps. "Events on 15 March":

```sql
SELECT count(*) FROM events
WHERE occurred_at >= '2025-03-15' AND occurred_at < '2025-03-16';
```

`occurred_at BETWEEN '2025-03-15' AND '2025-03-15'` would only match events at exactly midnight. And `occurred_at::date = '2025-03-15'` gives the right answer, but it wraps the column in a cast, so an index on `occurred_at` couldn't be used.

## "Now" and reproducibility

`current_date`, `now()` and `current_timestamp` return the current moment (`now()` is fixed for the whole transaction). Queries that use them give different answers on different days, so exercises in this course use fixed reference dates instead, for example `date '2026-01-01' - hire_date`. `age(later, earlier)` gives a "years mons days" interval, which is handy for tenure and ages.

## Calendars with generate_series

`generate_series(start, stop, step)` produces a row for each step. It's the standard way to build a calendar, for example so that days with no activity still appear:

```sql
SELECT d::date AS day
FROM generate_series(date '2025-03-01', date '2025-03-07', interval '1 day') AS d;
```

## Time zones

A `timestamptz` is an absolute instant. `AT TIME ZONE` converts it to the wall-clock time somewhere:

```sql
SELECT timestamptz '2025-07-01 12:00:00+00' AT TIME ZONE 'America/New_York' AS new_york,
       timestamptz '2025-07-01 12:00:00+00' AT TIME ZONE 'Asia/Tokyo'       AS tokyo;
```

This course's database runs in UTC. In your own systems, store instants as `timestamptz` and convert to local time only for display.

> **Dialect note.** SQL Server uses `DATEADD(day, 30, d)`, `DATEDIFF(day, a, b)`, `DATEPART` and `DATETRUNC` (2022+), with `datetimeoffset` for zone-aware values. MySQL uses `DATE_ADD(d, INTERVAL 30 DAY)`, `DATEDIFF(a, b)` and `DATE_FORMAT`. Oracle's `DATE` type includes a time of day; it uses `ADD_MONTHS`, `TRUNC(d, 'MM')` and `TO_CHAR`. `EXTRACT` is standard and works almost everywhere.
