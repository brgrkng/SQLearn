---
title: Projects without a home team
kind: problem
difficulty: easy
dataset: hr
ordered: true
---
Return the `name` of each project that belongs to a department with **no current employees**, together with the department's name. Sort by project name.

```sql solution
SELECT p.name AS project, d.name AS department
FROM projects p
JOIN departments d ON d.department_id = p.department_id
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id AND e.termination_date IS NULL)
ORDER BY p.name;
```

```sql wrong
SELECT p.name AS project, d.name AS department
FROM projects p
JOIN departments d ON d.department_id = p.department_id
WHERE NOT EXISTS (SELECT 1 FROM assignments a WHERE a.project_id = p.project_id)
ORDER BY p.name;
```
