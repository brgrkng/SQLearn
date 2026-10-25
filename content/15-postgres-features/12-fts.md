---
title: Search the catalogue
kind: drill
hints:
  - "`to_tsvector('english', name) @@ plainto_tsquery('english', 'lamps')`"
  - Stemming makes `lamps` match `Lamp`.
---
A shopper searches for **`lamps`**. Return the `name` of every product that matches using **full-text search** in English, so that plural and singular forms match.

```sql solution
SELECT name FROM products WHERE to_tsvector('english', name) @@ plainto_tsquery('english', 'lamps');
```

```sql wrong
SELECT name FROM products WHERE name ILIKE '%lamps%';
```
