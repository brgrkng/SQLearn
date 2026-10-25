---
title: Gold members per country
kind: drill
ordered: true
hints:
  - "`count(*) FILTER (WHERE loyalty_tier = 'gold')`"
---
For each `country`, return the total number of customers and the number of **gold** customers, sorted by country.

```sql starter
SELECT country, count(*)
FROM customers
WHERE loyalty_tier = 'gold'
GROUP BY country
ORDER BY country;
```

```sql solution
SELECT country, count(*) AS customers, count(*) FILTER (WHERE loyalty_tier = 'gold') AS gold
FROM customers
GROUP BY country
ORDER BY country;
```
