---
title: Record-breaking months
kind: problem
difficulty: medium
ordered: true
hints:
  - "`max(orders) OVER (ORDER BY month ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING)` is the best month *before* this one."
---
A month is a **record** if it had more orders than **every earlier month** (the very first month counts as a record). Return the record months (first day, as a `date`) and their order counts, in order.

```sql solution
WITH monthly AS (
  SELECT date_trunc('month', order_date)::date AS month, count(*) AS orders FROM orders GROUP BY 1
), with_best AS (
  SELECT month, orders,
         max(orders) OVER (ORDER BY month ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING) AS best_before
  FROM monthly
)
SELECT month, orders FROM with_best
WHERE best_before IS NULL OR orders > best_before
ORDER BY month;
```

```sql wrong
WITH monthly AS (
  SELECT date_trunc('month', order_date)::date AS month, count(*) AS orders FROM orders GROUP BY 1
)
SELECT month, orders FROM (
  SELECT month, orders, lag(orders) OVER (ORDER BY month) AS previous FROM monthly
) m
WHERE previous IS NULL OR orders > previous
ORDER BY month;
```

## Explanation
"More than every earlier month" compares each month with the **maximum** of all the months before it: a frame that ends one row before the current row. Comparing with just the previous month (`lag`) finds month-over-month increases, which is a different and much longer list.
