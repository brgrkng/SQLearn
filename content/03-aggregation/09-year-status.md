---
title: Year by status
kind: drill
ordered: true
---
Return `year`, `status` and the number of orders for every combination that exists, sorted by year, then status alphabetically.

```sql solution
SELECT extract(year FROM order_date) AS year, status, count(*) AS orders
FROM orders
GROUP BY year, status
ORDER BY year, status;
```

```sql wrong
SELECT extract(year FROM order_date) AS year, status, count(*) AS orders
FROM orders
GROUP BY year, status
ORDER BY status, year;
```
