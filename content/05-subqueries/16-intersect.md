---
title: Two Decembers in a row
kind: drill
ordered: true
hints:
  - "One query per December, combined with `INTERSECT`."
---
Return the `customer_id` of every customer who placed orders in **both December 2024 and December 2025**, sorted.

```sql solution
SELECT customer_id FROM orders WHERE order_date >= '2024-12-01' AND order_date < '2025-01-01'
INTERSECT
SELECT customer_id FROM orders WHERE order_date >= '2025-12-01' AND order_date < '2026-01-01'
ORDER BY customer_id;
```

```sql wrong
SELECT customer_id FROM orders WHERE order_date >= '2024-12-01' AND order_date < '2025-01-01'
UNION
SELECT customer_id FROM orders WHERE order_date >= '2025-12-01' AND order_date < '2026-01-01'
ORDER BY customer_id;
```
