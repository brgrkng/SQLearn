---
title: Employees and departments
kind: drill
dataset: hr
hints:
  - "Both tables have a `department_id` column, so `JOIN departments USING (department_id)` works."
---
For employees **managed by employee 4**, return `employee_id`, `first_name`, `last_name`, and the **name and location** of their department.

```sql starter
SELECT employee_id, first_name, last_name, department_id
FROM employees
WHERE manager_id = 4;
```

```sql solution
SELECT employee_id, first_name, last_name, d.name, d.location
FROM employees e
JOIN departments d USING (department_id)
WHERE e.manager_id = 4;
```
