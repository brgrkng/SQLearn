---
title: Revenue by category
kind: drill
ordered: true
hints:
  - "`order_items` → `products` → `categories`, then `GROUP BY` the category name."
---
Return each **category name** and the total revenue (`quantity × unit_price`) of its products across all order lines, highest revenue first. Only categories that have sold something appear.

```sql solution
SELECT cat.name, sum(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p     ON p.product_id = oi.product_id
JOIN categories cat ON cat.category_id = p.category_id
GROUP BY cat.name
ORDER BY revenue DESC;
```

```sql wrong
SELECT cat.name, sum(oi.quantity * p.price) AS revenue
FROM order_items oi
JOIN products p     ON p.product_id = oi.product_id
JOIN categories cat ON cat.category_id = p.category_id
GROUP BY cat.name
ORDER BY revenue DESC;
```
