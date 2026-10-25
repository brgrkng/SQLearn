---
title: Slower than usual
kind: problem
difficulty: medium
ordered: true
hints:
  - "`avg(shipped_date - order_date) OVER (PARTITION BY customer_id)` is each customer's usual shipping time, on every row."
---
For customers **1 to 20**, find shipped orders that took **longer to ship than that customer's average** (over all their shipped orders). Return `customer_id`, `order_id`, the order's shipping days and the customer's average rounded to 2 decimals. Sort by `customer_id`, then `order_id`.

```sql solution
WITH shipped AS (
  SELECT customer_id, order_id, shipped_date - order_date AS days,
         avg(shipped_date - order_date) OVER (PARTITION BY customer_id) AS avg_days
  FROM orders
  WHERE shipped_date IS NOT NULL AND customer_id <= 20
)
SELECT customer_id, order_id, days, round(avg_days, 2) AS avg_days
FROM shipped
WHERE days > avg_days
ORDER BY customer_id, order_id;
```

```sql wrong
WITH shipped AS (
  SELECT customer_id, order_id, shipped_date - order_date AS days,
         avg(shipped_date - order_date) OVER () AS avg_days
  FROM orders
  WHERE shipped_date IS NOT NULL AND customer_id <= 20
)
SELECT customer_id, order_id, days, round(avg_days, 2) AS avg_days
FROM shipped
WHERE days > avg_days
ORDER BY customer_id, order_id;
```
