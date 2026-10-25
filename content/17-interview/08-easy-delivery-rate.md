---
title: Delivery rate by year
kind: problem
difficulty: easy
ordered: true
---
For each year, return the year and the **percentage of that year's orders** with status `delivered`, rounded to 2 decimal places, in year order.

```sql solution
SELECT extract(year FROM order_date) AS year,
       round(100.0 * count(*) FILTER (WHERE status = 'delivered') / count(*), 2) AS delivered_pct
FROM orders
GROUP BY year
ORDER BY year;
```

```sql wrong
SELECT extract(year FROM order_date) AS year,
       round(100.0 * count(*) FILTER (WHERE status = 'delivered') / (SELECT count(*) FROM orders), 2) AS delivered_pct
FROM orders
GROUP BY year
ORDER BY year;
```
