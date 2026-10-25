---
title: The page before the cart
kind: problem
difficulty: medium
dataset: analytics
ordered: true
hints:
  - "`lag(page) OVER (PARTITION BY user_id ORDER BY occurred_at, event_id)` is the previous event's page."
  - Filter to add_to_cart events in an outer query, because window functions can't go in WHERE.
---
Which page do users view **immediately before** adding to cart? For every `add_to_cart` event, look at the same user's previous event. Return that previous event's `page` and how many times it preceded an add-to-cart, most frequent first, ties broken by page.

```sql solution
WITH seq AS (
  SELECT event_type, lag(page) OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS previous_page
  FROM events
)
SELECT previous_page AS page, count(*) AS times
FROM seq
WHERE event_type = 'add_to_cart'
GROUP BY previous_page
ORDER BY times DESC, page;
```

```sql wrong
WITH seq AS (
  SELECT event_type, lag(page) OVER (PARTITION BY user_id ORDER BY occurred_at, event_id) AS previous_page
  FROM events
  WHERE event_type IN ('add_to_cart', 'checkout')
)
SELECT previous_page AS page, count(*) AS times
FROM seq
WHERE event_type = 'add_to_cart'
GROUP BY previous_page
ORDER BY times DESC, page;
```
