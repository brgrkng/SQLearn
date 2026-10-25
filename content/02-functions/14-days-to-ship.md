---
title: Days to ship
kind: drill
hints:
  - Subtracting one date from another gives a number of days.
---
For orders placed on **2025-05-01** that have shipped, return `order_id`, `order_date`, `shipped_date`, and the number of **days it took to ship**.

```sql starter
SELECT order_id, order_date, shipped_date
FROM orders
WHERE order_date = '2025-05-01';
```

```sql solution
SELECT order_id, order_date, shipped_date, shipped_date - order_date AS days_to_ship
FROM orders
WHERE order_date = '2025-05-01' AND shipped_date IS NOT NULL;
```

```sql wrong
SELECT order_id, order_date, shipped_date, shipped_date - order_date AS days_to_ship
FROM orders
WHERE order_date = '2025-05-01';
```
