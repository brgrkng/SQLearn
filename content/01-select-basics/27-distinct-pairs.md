---
title: Cities by country
kind: drill
ordered: true
hints:
  - DISTINCT applies to the whole row.
  - Filter out unknown cities with `WHERE`.
---
Return every distinct **(country, city)** pair among customers, **excluding customers with no city**. Sort by country, then city.

```sql starter
SELECT DISTINCT country, city
FROM customers
```

```sql solution
SELECT DISTINCT country, city
FROM customers
WHERE city IS NOT NULL
ORDER BY country, city;
```
