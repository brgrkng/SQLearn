---
title: Headcount including empty departments
kind: drill
dataset: hr
ordered: true
hints:
  - An inner join drops Research, which has nobody.
  - "With a LEFT JOIN, `count(*)` counts the NULL-padded row as 1. Count an employee column instead."
---
Return every department's `name` and its number of employees (current or former), **including departments with nobody in them**. Sort by name.

```sql starter
SELECT d.name, count(*) AS employees
FROM departments d
JOIN employees e ON e.department_id = d.department_id
GROUP BY d.name
ORDER BY d.name;
```

```sql solution
SELECT d.name, count(e.employee_id) AS employees
FROM departments d
LEFT JOIN employees e ON e.department_id = d.department_id
GROUP BY d.name
ORDER BY d.name;
```

```sql wrong
SELECT d.name, count(*) AS employees
FROM departments d
LEFT JOIN employees e ON e.department_id = d.department_id
GROUP BY d.name
ORDER BY d.name;
```
