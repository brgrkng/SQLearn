---
title: A customer every year
kind: problem
difficulty: easy
ordered: true
hints:
  - Count the distinct order years per customer.
---
Return the `customer_id` of customers who placed at least one order in **each** of the years **2022, 2023, 2024 and 2025**. Sort by `customer_id`.

```sql solution
SELECT customer_id
FROM orders
WHERE order_date >= '2022-01-01' AND order_date < '2026-01-01'
GROUP BY customer_id
HAVING count(DISTINCT extract(year FROM order_date)) = 4
ORDER BY customer_id;
```

```sql wrong
SELECT customer_id
FROM orders
GROUP BY customer_id
HAVING count(*) >= 4
ORDER BY customer_id;
```
