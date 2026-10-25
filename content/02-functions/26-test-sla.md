---
title: Shipping SLA
kind: test
---
For orders placed on **2025-11-03**, return `order_id` and a shipping verdict:

- `not shipped` if there is no `shipped_date`
- `on time` if it shipped within **3 days** of the order date
- `late` otherwise

```sql solution
SELECT order_id,
       CASE WHEN shipped_date IS NULL THEN 'not shipped'
            WHEN shipped_date - order_date <= 3 THEN 'on time'
            ELSE 'late' END AS verdict
FROM orders
WHERE order_date = '2025-11-03';
```

```sql wrong
SELECT order_id,
       CASE WHEN shipped_date - order_date <= 3 THEN 'on time' ELSE 'late' END AS verdict
FROM orders
WHERE order_date = '2025-11-03';
```

```sql wrong
SELECT order_id,
       CASE WHEN shipped_date IS NULL THEN 'not shipped'
            WHEN shipped_date - order_date < 3 THEN 'on time'
            ELSE 'late' END AS verdict
FROM orders
WHERE order_date = '2025-11-03';
```
