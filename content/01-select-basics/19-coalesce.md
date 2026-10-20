---
title: A default tier
kind: drill
hints:
  - "`coalesce(a, b)` returns `a` unless it is NULL, in which case it returns `b`."
---
For customers in **Canada**, return the `customer_id` and their loyalty tier, showing **`standard`** for customers who have no tier.

```sql starter
SELECT customer_id, loyalty_tier
FROM customers
WHERE country = 'Canada';
```

```sql solution
SELECT customer_id, coalesce(loyalty_tier, 'standard') AS tier FROM customers WHERE country = 'Canada';
```
