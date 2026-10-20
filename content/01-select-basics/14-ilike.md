---
title: The search box
kind: drill
hints:
  - "`LIKE` is case-sensitive in PostgreSQL. Which operator isn't?"
---
A shopper types **bike** into the search box. Return the `name` of every product whose name contains *bike* anywhere, **in any capitalisation**.

```sql starter
SELECT name
FROM products
WHERE name LIKE '%bike%';
```

```sql solution
SELECT name FROM products WHERE name ILIKE '%bike%';
```

## Explanation
The starter returns nothing because every product name spells it `Bike` with a capital B. `ILIKE` ignores case. `lower(name) LIKE '%bike%'` gives the same answer and also works in other databases.
