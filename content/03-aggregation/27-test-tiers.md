---
title: Tier breakdown
kind: test
ordered: true
---
Return each loyalty tier and its number of customers, showing customers with no tier as **`none`**. Sort by the number of customers, largest first.

```sql solution
SELECT coalesce(loyalty_tier, 'none') AS tier, count(*) AS customers
FROM customers
GROUP BY tier
ORDER BY customers DESC;
```

```sql wrong
SELECT loyalty_tier AS tier, count(loyalty_tier) AS customers
FROM customers
GROUP BY loyalty_tier
ORDER BY customers DESC;
```
