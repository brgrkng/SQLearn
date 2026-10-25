---
title: Long-running projects
kind: problem
difficulty: easy
dataset: hr
ordered: true
hints:
  - "Ongoing projects have no `end_date`. Treat them as running until 2026-01-01."
---
Return the `name` of each project that has run (or, if still ongoing, will have run by **2026-01-01**) for **more than 365 days**, with its duration in days. Longest first, ties broken by name.

```sql solution
SELECT name, coalesce(end_date, date '2026-01-01') - start_date AS days
FROM projects
WHERE coalesce(end_date, date '2026-01-01') - start_date > 365
ORDER BY days DESC, name;
```

```sql wrong
SELECT name, end_date - start_date AS days
FROM projects
WHERE end_date - start_date > 365
ORDER BY days DESC, name;
```
