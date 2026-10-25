---
title: Busier than average
kind: drill
ordered: true
hints:
  - "A CTE with orders per customer, then `WHERE n > (SELECT avg(n) FROM that_cte)`."
---
Using a CTE, return the `customer_id` and order count of customers in **Spain** who placed **more orders than the average customer** (average over all customers who have ordered, from any country). Sort by order count descending, then `customer_id`.

```sql solution
WITH per_customer AS (
  SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id
)
SELECT pc.customer_id, pc.n
FROM per_customer pc
JOIN customers c ON c.customer_id = pc.customer_id
WHERE c.country = 'Spain' AND pc.n > (SELECT avg(n) FROM per_customer)
ORDER BY pc.n DESC, pc.customer_id;
```

```sql wrong
WITH per_customer AS (
  SELECT o.customer_id, count(*) AS n
  FROM orders o JOIN customers c ON c.customer_id = o.customer_id
  WHERE c.country = 'Spain'
  GROUP BY o.customer_id
)
SELECT customer_id, n FROM per_customer
WHERE n > (SELECT avg(n) FROM per_customer)
ORDER BY n DESC, customer_id;
```
