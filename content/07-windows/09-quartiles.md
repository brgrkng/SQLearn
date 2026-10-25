---
title: Spend quartiles
kind: drill
ordered: true
hints:
  - Compute total spend per customer first, then `ntile(4) OVER (ORDER BY spend DESC)`.
---
For customers in **Nigeria** who have ordered, compute each one's total spend (`quantity × unit_price`) and assign a **spend quartile**: 1 for the top quarter, 4 for the bottom. Return `customer_id`, spend and quartile, sorted by spend descending, then `customer_id`.

```sql solution
WITH spend AS (
  SELECT o.customer_id, sum(oi.quantity * oi.unit_price) AS spend
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  JOIN customers c    ON c.customer_id = o.customer_id
  WHERE c.country = 'Nigeria'
  GROUP BY o.customer_id
)
SELECT customer_id, spend, ntile(4) OVER (ORDER BY spend DESC, customer_id) AS quartile
FROM spend
ORDER BY spend DESC, customer_id;
```

```sql wrong
WITH spend AS (
  SELECT o.customer_id, sum(oi.quantity * oi.unit_price) AS spend
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  JOIN customers c    ON c.customer_id = o.customer_id
  WHERE c.country = 'Nigeria'
  GROUP BY o.customer_id
)
SELECT customer_id, spend, ntile(4) OVER (ORDER BY spend, customer_id) AS quartile
FROM spend
ORDER BY spend DESC, customer_id;
```
