---
title: Lapsed customers
kind: drill
ordered: true
hints:
  - "Two conditions: ordered at some point before 2025 (`EXISTS`), and not in 2025 (`NOT EXISTS`)."
---
Find **lapsed** customers: they ordered at least once **before 2025** but **never in 2025**. Return their `customer_id` and `last_name`, sorted by `customer_id`.

```sql solution
SELECT c.customer_id, c.last_name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id AND o.order_date < '2025-01-01')
  AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
                  AND o.order_date >= '2025-01-01' AND o.order_date < '2026-01-01')
ORDER BY c.customer_id;
```

```sql wrong
SELECT c.customer_id, c.last_name
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
                  AND o.order_date >= '2025-01-01' AND o.order_date < '2026-01-01')
ORDER BY c.customer_id;
```
