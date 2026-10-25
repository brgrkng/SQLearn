---
title: Longest ordering streaks
kind: problem
difficulty: hard
ordered: true
hints:
  - Distinct order dates per customer, then `order_date - row_number()` to find islands of consecutive days.
  - Keep each customer's longest island, then rank customers by it.
---
For each customer, find their **longest run of consecutive days** on which they placed at least one order. Return the **5 customers with the longest runs**: `customer_id`, the run length and the run's first day. Longest first; ties broken by the earlier start day, then `customer_id`. (If a customer has several runs of their maximum length, use the earliest.)

```sql solution
WITH days AS (
  SELECT DISTINCT customer_id, order_date FROM orders
), islands AS (
  SELECT customer_id, order_date,
         order_date - row_number() OVER (PARTITION BY customer_id ORDER BY order_date)::int AS grp
  FROM days
), runs AS (
  SELECT customer_id, count(*) AS len, min(order_date) AS start_day FROM islands GROUP BY customer_id, grp
), best AS (
  SELECT DISTINCT ON (customer_id) customer_id, len, start_day
  FROM runs ORDER BY customer_id, len DESC, start_day
)
SELECT customer_id, len, start_day FROM best
ORDER BY len DESC, start_day, customer_id
LIMIT 5;
```

```sql wrong
WITH days AS (
  SELECT DISTINCT customer_id, order_date FROM orders
)
SELECT customer_id, count(*) AS len, min(order_date) AS start_day
FROM days
GROUP BY customer_id
ORDER BY len DESC, start_day, customer_id
LIMIT 5;
```
