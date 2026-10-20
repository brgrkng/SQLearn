---
title: Latest shipments
kind: drill
ordered: true
hints:
  - Run the obvious query first and look at what comes out on top.
  - "`NULLS LAST`, or filter out orders that haven't shipped."
---
The warehouse dashboard shows the **10 most recently shipped orders**: `order_id` and `shipped_date`, newest shipment first, ties broken by `order_id`.

```sql starter
SELECT order_id, shipped_date
FROM orders
ORDER BY shipped_date DESC, order_id
LIMIT 10;
```

```sql solution
SELECT order_id, shipped_date
FROM orders
ORDER BY shipped_date DESC NULLS LAST, order_id
LIMIT 10;
```

## Explanation
In PostgreSQL, NULLs sort as the largest values, so `DESC` puts every unshipped order first. `NULLS LAST` fixes the ordering, and `WHERE shipped_date IS NOT NULL` removes those rows entirely. Both give the right answer here.
