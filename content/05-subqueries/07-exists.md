---
title: Departments with a high earner
kind: drill
dataset: hr
ordered: true
hints:
  - "`WHERE EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id AND ...)`"
---
Return the `name` of every department that has at least one **current** employee earning **more than 150,000**, sorted by name.

```sql starter
SELECT d.name
FROM departments d
JOIN employees e ON e.department_id = d.department_id
WHERE e.salary > 150000
ORDER BY d.name;
```

```sql solution
SELECT d.name
FROM departments d
WHERE EXISTS (SELECT 1 FROM employees e
              WHERE e.department_id = d.department_id AND e.salary > 150000 AND e.termination_date IS NULL)
ORDER BY d.name;
```
