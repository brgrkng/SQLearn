---
title: Monthly funnel
kind: problem
difficulty: medium
dataset: analytics
ordered: true
hints:
  - "One pass over `events` with `count(DISTINCT user_id) FILTER (WHERE event_type = ...)` per step."
---
For each month (first day, as a `date`), return the number of distinct users who had a **page_view**, an **add_to_cart**, a **checkout** and a **purchase** that month, plus the **view-to-purchase conversion** (purchasers ÷ viewers) as a percentage rounded to 1 decimal place. In month order.

```sql solution
SELECT date_trunc('month', occurred_at)::date AS month,
       count(DISTINCT user_id) FILTER (WHERE event_type = 'page_view')   AS viewers,
       count(DISTINCT user_id) FILTER (WHERE event_type = 'add_to_cart') AS carters,
       count(DISTINCT user_id) FILTER (WHERE event_type = 'checkout')    AS checkouts,
       count(DISTINCT user_id) FILTER (WHERE event_type = 'purchase')    AS purchasers,
       round(100.0 * count(DISTINCT user_id) FILTER (WHERE event_type = 'purchase')
                   / count(DISTINCT user_id) FILTER (WHERE event_type = 'page_view'), 1) AS conversion_pct
FROM events
GROUP BY 1
ORDER BY 1;
```

```sql wrong
SELECT date_trunc('month', occurred_at)::date AS month,
       count(*) FILTER (WHERE event_type = 'page_view')   AS viewers,
       count(*) FILTER (WHERE event_type = 'add_to_cart') AS carters,
       count(*) FILTER (WHERE event_type = 'checkout')    AS checkouts,
       count(*) FILTER (WHERE event_type = 'purchase')    AS purchasers,
       round(100.0 * count(*) FILTER (WHERE event_type = 'purchase')
                   / count(*) FILTER (WHERE event_type = 'page_view'), 1) AS conversion_pct
FROM events
GROUP BY 1
ORDER BY 1;
```
