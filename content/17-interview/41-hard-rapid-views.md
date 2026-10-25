---
title: Rapid repeat views
kind: problem
difficulty: hard
dataset: analytics
ordered: true
hints:
  - "A window over each user's views of the same page, framed by time: `RANGE BETWEEN INTERVAL '10 minutes' PRECEDING AND CURRENT ROW`."
---
Flag **rapid repeat views**: a page view is *rapid* if the **same user** viewed the **same page** at least **twice** in the 10 minutes up to and including that view (counting the view itself). For each page, return how many page views were rapid. Most first, ties broken by page.

```sql solution
WITH windowed AS (
  SELECT page,
         count(*) OVER (PARTITION BY user_id, page ORDER BY occurred_at
                        RANGE BETWEEN INTERVAL '10 minutes' PRECEDING AND CURRENT ROW) AS recent_views
  FROM events
  WHERE event_type = 'page_view'
)
SELECT page, count(*) AS rapid_views
FROM windowed
WHERE recent_views >= 2
GROUP BY page
ORDER BY rapid_views DESC, page;
```

```sql wrong
WITH windowed AS (
  SELECT page,
         count(*) OVER (PARTITION BY user_id, page ORDER BY occurred_at
                        ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS recent_views
  FROM events
  WHERE event_type = 'page_view'
)
SELECT page, count(*) AS rapid_views
FROM windowed
WHERE recent_views >= 2
GROUP BY page
ORDER BY rapid_views DESC, page;
```

## Explanation
`ROWS BETWEEN 1 PRECEDING AND CURRENT ROW` counts the previous view however long ago it happened. A `RANGE` frame with an interval looks back by **time**, which is what "within 10 minutes" means.
