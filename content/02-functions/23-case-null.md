---
title: Tier discounts
kind: drill
hints:
  - "A simple `CASE loyalty_tier WHEN NULL ...` never matches. NULL isn't equal to anything."
---
Loyalty tiers earn a discount: platinum 15%, gold 10%, silver 5%, and **no tier 0%**. For customers in **India**, return `customer_id`, `loyalty_tier` and the discount as a number (15, 10, 5 or 0).

```sql starter
SELECT customer_id, loyalty_tier,
       CASE loyalty_tier WHEN 'platinum' THEN 15 WHEN 'gold' THEN 10 WHEN 'silver' THEN 5 WHEN NULL THEN 0 END AS discount
FROM customers
WHERE country = 'India';
```

```sql solution
SELECT customer_id, loyalty_tier,
       CASE loyalty_tier WHEN 'platinum' THEN 15 WHEN 'gold' THEN 10 WHEN 'silver' THEN 5 ELSE 0 END AS discount
FROM customers
WHERE country = 'India';
```
