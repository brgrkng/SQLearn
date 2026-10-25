---
title: Ordered three days running
kind: problem
difficulty: medium
ordered: true
hints:
  - Distinct order dates per customer, then the gaps-and-islands trick.
  - Keep islands of at least three days.
---
Find customers who placed orders on **at least three consecutive days** at some point. Return `customer_id` and the first day of their **earliest** such streak. Sort by `customer_id`.

```sql solution
WITH days AS (
  SELECT DISTINCT customer_id, order_date FROM orders
), islands AS (
  SELECT customer_id, order_date,
         order_date - row_number() OVER (PARTITION BY customer_id ORDER BY order_date)::int AS island
  FROM days
), streaks AS (
  SELECT customer_id, min(order_date) AS start_day, count(*) AS length
  FROM islands GROUP BY customer_id, island
)
SELECT customer_id, min(start_day) AS first_streak
FROM streaks
WHERE length >= 3
GROUP BY customer_id
ORDER BY customer_id;
```

```sql wrong
WITH days AS (
  SELECT DISTINCT customer_id, order_date FROM orders
), islands AS (
  SELECT customer_id, order_date,
         order_date - row_number() OVER (PARTITION BY customer_id ORDER BY order_date)::int AS island
  FROM days
), streaks AS (
  SELECT customer_id, min(order_date) AS start_day, count(*) AS length
  FROM islands GROUP BY customer_id, island
)
SELECT customer_id, min(start_day) AS first_streak
FROM streaks
WHERE length >= 2
GROUP BY customer_id
ORDER BY customer_id;
```
