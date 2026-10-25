---
title: Active customers in 2025
kind: drill
hints:
  - Each customer can have many orders. Count each one once.
---
How many **different customers** placed at least one order in **2025**? Return a single number.

```sql starter
SELECT count(customer_id)
FROM orders
WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01';
```

```sql solution
SELECT count(DISTINCT customer_id)
FROM orders
WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01';
```
