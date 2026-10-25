---
title: Top cities
kind: problem
difficulty: easy
ordered: true
hints:
  - Customers with no city shouldn't count as a city.
  - "`rank() OVER (ORDER BY count(*) DESC)` gives tied cities the same rank. Keep rank 4 and better."
---
Return the **4 cities with the most customers** (ignoring customers with no city), with their country and customer count. If cities tie for fourth place, include all of them. Most customers first, then city name.

```sql solution
WITH ranked AS (
  SELECT city, country, count(*) AS customers, rank() OVER (ORDER BY count(*) DESC) AS r
  FROM customers
  WHERE city IS NOT NULL
  GROUP BY city, country
)
SELECT city, country, customers FROM ranked WHERE r <= 4 ORDER BY customers DESC, city;
```

```sql wrong
SELECT city, country, count(*) AS customers
FROM customers
WHERE city IS NOT NULL
GROUP BY city, country
ORDER BY customers DESC, city
LIMIT 4;
```

## Explanation
`FETCH FIRST 4 ROWS WITH TIES` looks like the tool for this, but it treats rows as tied only when **every** `ORDER BY` column matches, and the `city` tiebreaker makes every row unique. Ranking on the count alone, then sorting the survivors however you like, separates "which rows qualify" from "how to display them".
