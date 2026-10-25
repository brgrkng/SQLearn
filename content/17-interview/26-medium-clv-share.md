---
title: Top customers' share
kind: problem
difficulty: medium
ordered: true
hints:
  - Spend per customer first, then `spend / sum(spend) OVER ()` for the share of all revenue.
---
Return the **10 customers with the highest lifetime spend** (sum of `quantity × unit_price` over all their order lines): `customer_id`, spend, and their **percentage of total revenue** rounded to 2 decimals. Highest spend first.

```sql solution
WITH spend AS (
  SELECT o.customer_id, sum(oi.quantity * oi.unit_price) AS spend
  FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
  GROUP BY o.customer_id
)
SELECT customer_id, spend, round(100 * spend / sum(spend) OVER (), 2) AS pct_of_revenue
FROM spend
ORDER BY spend DESC
LIMIT 10;
```

```sql wrong
WITH spend AS (
  SELECT o.customer_id, sum(oi.quantity * oi.unit_price) AS spend
  FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
  GROUP BY o.customer_id
  ORDER BY spend DESC
  LIMIT 10
)
SELECT customer_id, spend, round(100 * spend / sum(spend) OVER (), 2) AS pct_of_revenue
FROM spend
ORDER BY spend DESC;
```

## Explanation
Window functions see only the rows that reach them. Limiting to the top 10 **before** computing `sum(spend) OVER ()` makes each customer's share relative to the top 10 rather than to all revenue.
