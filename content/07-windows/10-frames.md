---
title: Running totals and window frames
kind: lesson
---
Adding `ORDER BY` inside `OVER` turns an aggregate into a **running** aggregate. Each row sees the rows from the start of its partition up to itself:

```sql
WITH daily AS (
  SELECT order_date, count(*) AS orders
  FROM orders
  WHERE order_date >= '2025-01-01' AND order_date < '2025-01-11'
  GROUP BY order_date
)
SELECT order_date, orders,
       sum(orders) OVER (ORDER BY order_date) AS running_total
FROM daily
ORDER BY order_date;
```

## The frame

The set of rows an aggregate sees for the current row is its **frame**. Without `ORDER BY`, the frame is the whole partition. With `ORDER BY`, the default frame is:

```sql norun
RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
```

`RANGE` treats rows with **equal** `ORDER BY` values as peers, so they all get the same running total. That surprises people when the sort key has ties:

```sql
SELECT order_id, order_date,
       count(*) OVER (ORDER BY order_date)                              AS range_count,
       count(*) OVER (ORDER BY order_date ROWS UNBOUNDED PRECEDING)     AS rows_count
FROM orders
WHERE order_date BETWEEN '2025-01-01' AND '2025-01-02'
ORDER BY order_date, order_id
LIMIT 8;
```

`ROWS` counts physical rows, one at a time. Use it, with a unique sort order, when you want a strict row-by-row running total.

## Moving windows

Frames can have both ends relative to the current row. A 7-day moving average over daily rows:

```sql
WITH daily AS (
  SELECT order_date, count(*) AS orders
  FROM orders
  WHERE order_date >= '2025-03-01' AND order_date < '2025-04-01'
  GROUP BY order_date
)
SELECT order_date, orders,
       round(avg(orders) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 1) AS moving_avg_7
FROM daily
ORDER BY order_date;
```

`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` means "this row and the six before it". If some days are missing, that's not the same as seven calendar days. `RANGE` with an interval measures by value instead:

```sql norun
avg(orders) OVER (ORDER BY order_date RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW)
```

The full frame syntax is `{ROWS | RANGE | GROUPS} BETWEEN start AND end`, where each end is `UNBOUNDED PRECEDING`, `n PRECEDING`, `CURRENT ROW`, `n FOLLOWING` or `UNBOUNDED FOLLOWING`. `GROUPS` counts groups of peers.

## Naming windows

When several functions share a window, name it once with `WINDOW`:

```sql
SELECT order_date, count(*) AS orders,
       sum(count(*)) OVER w AS running,
       avg(count(*)) OVER w AS running_avg
FROM orders
WHERE order_date >= '2025-02-01' AND order_date < '2025-02-08'
GROUP BY order_date
WINDOW w AS (ORDER BY order_date)
ORDER BY order_date;
```

## Cost

Each distinct `PARTITION BY` / `ORDER BY` combination usually needs a sort. Functions that share the same window share the same sort, so prefer one window over several slightly different ones. An index matching the window's order can remove the sort entirely.

> **Dialect note.** `ROWS` and `RANGE` frames are widely supported. `RANGE` with interval offsets and `GROUPS` frames are newer: SQL Server supports neither interval offsets nor `GROUPS`, and MySQL supports interval `RANGE` but not `GROUPS`.
