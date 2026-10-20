---
title: Everyone who isn't gold
kind: drill
hints:
  - What does `NULL <> 'gold'` evaluate to?
  - Either add `OR loyalty_tier IS NULL`, or use `IS DISTINCT FROM`.
---
Gold-tier customers already get free shipping. Return the `customer_id` and `loyalty_tier` of **every other customer**, including customers who have no loyalty tier at all.

```sql starter
SELECT customer_id, loyalty_tier
FROM customers
WHERE loyalty_tier <> 'gold';
```

```sql solution
SELECT customer_id, loyalty_tier FROM customers WHERE loyalty_tier IS DISTINCT FROM 'gold';
```

```sql wrong
SELECT customer_id, loyalty_tier FROM customers WHERE NOT loyalty_tier = 'gold';
```

## Explanation
The starter misses about 3,000 customers. For a customer with no tier, `loyalty_tier <> 'gold'` is NULL rather than true, so `WHERE` drops the row. `NOT (loyalty_tier = 'gold')` has the same problem, because `NOT NULL` is still NULL. Either of these works:

- `loyalty_tier <> 'gold' OR loyalty_tier IS NULL`
- `loyalty_tier IS DISTINCT FROM 'gold'`
