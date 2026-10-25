---
title: Where we ship
kind: drill
ordered: true
---
Return each **country** that has at least one customer, once, in alphabetical order.

```sql starter
SELECT country
FROM customers
ORDER BY country;
```

```sql solution
SELECT DISTINCT country FROM customers ORDER BY country;
```
