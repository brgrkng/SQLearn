---
title: Share of revenue
kind: drill
ordered: true
hints:
  - Group by category to get each category's revenue, then divide by `sum(...) OVER ()`.
---
Return each **category name**, its revenue (`quantity × unit_price`, all order lines) and its **percentage of total revenue** rounded to 2 decimals. Highest revenue first.

```sql solution
SELECT cat.name, sum(oi.quantity * oi.unit_price) AS revenue,
       round(100 * sum(oi.quantity * oi.unit_price) / sum(sum(oi.quantity * oi.unit_price)) OVER (), 2) AS pct
FROM order_items oi
JOIN products p     ON p.product_id = oi.product_id
JOIN categories cat ON cat.category_id = p.category_id
GROUP BY cat.name
ORDER BY revenue DESC;
```

```sql wrong
SELECT cat.name, sum(oi.quantity * oi.unit_price) AS revenue,
       round(100 * sum(oi.quantity * oi.unit_price) / sum(oi.quantity * oi.unit_price), 2) AS pct
FROM order_items oi
JOIN products p     ON p.product_id = oi.product_id
JOIN categories cat ON cat.category_id = p.category_id
GROUP BY cat.name
ORDER BY revenue DESC;
```
