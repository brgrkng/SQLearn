---
title: Customers per country
kind: drill
ordered: true
hints:
  - "`GROUP BY country`, then sort by the count."
---
Return each `country` and its number of customers, the **largest first**, ties broken alphabetically by country.

```sql starter
SELECT country, count(*)
FROM customers
```

```sql solution
SELECT country, count(*) AS customers FROM customers GROUP BY country ORDER BY customers DESC, country;
```

```sql wrong
SELECT country, count(*) AS customers FROM customers GROUP BY country ORDER BY country;
```
