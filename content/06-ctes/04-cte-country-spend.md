---
title: Big spenders by country
kind: drill
ordered: true
hints:
  - "CTE 1: total spend per customer (with their country). CTE 2: average of those totals per country."
  - Then join the two and compare.
---
A customer is a **big spender** if their total spend (sum of `quantity × unit_price` over all their orders) is **more than double their country's average** customer spend (averaged over customers in that country who have ordered). Return `customer_id`, `country` and total spend for big spenders in **Canada**, sorted by spend descending.

```sql solution
WITH spend AS (
  SELECT c.customer_id, c.country, sum(oi.quantity * oi.unit_price) AS total
  FROM customers c
  JOIN orders o       ON o.customer_id = c.customer_id
  JOIN order_items oi ON oi.order_id = o.order_id
  GROUP BY c.customer_id, c.country
),
country_avg AS (
  SELECT country, avg(total) AS avg_total FROM spend GROUP BY country
)
SELECT s.customer_id, s.country, s.total
FROM spend s
JOIN country_avg a ON a.country = s.country
WHERE s.country = 'Canada' AND s.total > 2 * a.avg_total
ORDER BY s.total DESC;
```

```sql wrong
WITH spend AS (
  SELECT c.customer_id, c.country, sum(oi.quantity * oi.unit_price) AS total
  FROM customers c
  JOIN orders o       ON o.customer_id = c.customer_id
  JOIN order_items oi ON oi.order_id = o.order_id
  GROUP BY c.customer_id, c.country
)
SELECT customer_id, country, total
FROM spend
WHERE country = 'Canada' AND total > 2 * (SELECT avg(total) FROM spend)
ORDER BY total DESC;
```
