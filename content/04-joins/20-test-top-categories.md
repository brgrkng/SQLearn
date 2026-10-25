---
title: Top categories in 2025
kind: test
ordered: true
---
Return the **names of the 5 categories** with the highest revenue (`quantity × unit_price`) from orders placed in **2025**, with the revenue, highest first.

```sql solution
SELECT cat.name, sum(oi.quantity * oi.unit_price) AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN products p     ON p.product_id = oi.product_id
JOIN categories cat ON cat.category_id = p.category_id
WHERE o.order_date >= '2025-01-01' AND o.order_date < '2026-01-01'
GROUP BY cat.name
ORDER BY revenue DESC
LIMIT 5;
```

```sql wrong
SELECT cat.name, sum(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p     ON p.product_id = oi.product_id
JOIN categories cat ON cat.category_id = p.category_id
GROUP BY cat.name
ORDER BY revenue DESC
LIMIT 5;
```
