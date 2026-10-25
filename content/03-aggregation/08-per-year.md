---
title: Orders per year
kind: drill
ordered: true
hints:
  - "Group by `extract(year FROM order_date)`."
---
Return each **year** and the number of orders placed in it, oldest year first.

```sql starter
SELECT order_date, count(*)
FROM orders
GROUP BY order_date;
```

```sql solution
SELECT extract(year FROM order_date) AS year, count(*) AS orders
FROM orders
GROUP BY year
ORDER BY year;
```
