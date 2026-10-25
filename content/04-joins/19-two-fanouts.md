---
title: People and projects per department
kind: drill
dataset: hr
ordered: true
hints:
  - "Joining employees **and** projects to departments multiplies every employee by every project."
  - Aggregate each side in its own subquery, or count distinct ids.
---
For each department that **has employees**, return `department_id`, its number of employees (current or former) and its number of **projects** (from `projects.department_id`). Sort by `department_id`.

```sql starter
SELECT d.department_id, count(e.employee_id) AS employees, count(p.project_id) AS projects
FROM departments d
JOIN employees e     ON e.department_id = d.department_id
LEFT JOIN projects p ON p.department_id = d.department_id
GROUP BY d.department_id
ORDER BY d.department_id;
```

```sql solution
SELECT d.department_id,
       (SELECT count(*) FROM employees e WHERE e.department_id = d.department_id) AS employees,
       (SELECT count(*) FROM projects p WHERE p.department_id = d.department_id) AS projects
FROM departments d
WHERE EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id)
ORDER BY d.department_id;
```

```sql wrong
SELECT d.department_id, count(DISTINCT e.employee_id) AS employees, count(p.project_id) AS projects
FROM departments d
JOIN employees e     ON e.department_id = d.department_id
LEFT JOIN projects p ON p.department_id = d.department_id
GROUP BY d.department_id
ORDER BY d.department_id;
```

## Explanation
The starter pairs every employee with every project in their department, so Engineering's 93 people and 5 projects produce 465 rows, and both counts are wrong. `count(DISTINCT e.employee_id)` and `count(DISTINCT p.project_id)` fix the counts. The reference solution instead computes each count independently with correlated subqueries (Module 5), which also works for sums, where `DISTINCT` can't help.
