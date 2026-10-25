---
title: Email coverage
kind: drill
ordered: true
hints:
  - "`count(email)` skips NULLs. Divide by `count(*)` and multiply by `100.0`, not `100`."
---
For each `country`, return the **percentage of customers who have an email address**, rounded to 1 decimal place, lowest coverage first, ties broken by country.

```sql starter
SELECT country, count(email) * 100 / count(*) AS pct
FROM customers
GROUP BY country;
```

```sql solution
SELECT country, round(100.0 * count(email) / count(*), 1) AS pct
FROM customers
GROUP BY country
ORDER BY pct, country;
```
