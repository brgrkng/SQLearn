---
title: Borrowed teams
kind: test
dataset: hr
ordered: true
---
Return the `name` of every project that has people assigned, but **none of them** belong to the project's own department. Sort by name.

```sql solution
SELECT p.name
FROM projects p
WHERE EXISTS (SELECT 1 FROM assignments a WHERE a.project_id = p.project_id)
  AND NOT EXISTS (SELECT 1 FROM assignments a JOIN employees e ON e.employee_id = a.employee_id
                  WHERE a.project_id = p.project_id AND e.department_id = p.department_id)
ORDER BY p.name;
```

```sql wrong
SELECT DISTINCT p.name
FROM projects p
JOIN assignments a ON a.project_id = p.project_id
JOIN employees e ON e.employee_id = a.employee_id
WHERE e.department_id <> p.department_id
ORDER BY p.name;
```
