---
title: Status board
kind: drill
ordered: true
hints:
  - "`ORDER BY CASE status WHEN ... THEN 1 ... END`, then a tiebreaker."
---
The warehouse board lists the orders placed on **2025-12-27**, grouped by status in workflow order: **pending, shipped, delivered, returned, cancelled**. Within a status, sort by `order_id`. Return `order_id` and `status`.

```sql starter
SELECT order_id, status
FROM orders
WHERE order_date = '2025-12-27'
ORDER BY status, order_id;
```

```sql solution
SELECT order_id, status
FROM orders
WHERE order_date = '2025-12-27'
ORDER BY CASE status WHEN 'pending' THEN 1 WHEN 'shipped' THEN 2 WHEN 'delivered' THEN 3
                     WHEN 'returned' THEN 4 ELSE 5 END,
         order_id;
```
