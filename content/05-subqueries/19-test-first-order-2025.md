---
title: New in 2025
kind: test
ordered: true
---
Return the `customer_id` of customers whose **first ever order** was placed in **2025**, sorted.

```sql solution
SELECT customer_id
FROM orders
GROUP BY customer_id
HAVING min(order_date) >= '2025-01-01'
ORDER BY customer_id;
```

```sql wrong
SELECT DISTINCT customer_id
FROM orders
WHERE order_date >= '2025-01-01'
ORDER BY customer_id;
```
