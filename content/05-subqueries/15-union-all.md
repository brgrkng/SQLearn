---
title: Project roster
kind: drill
dataset: hr
ordered: true
hints:
  - "Two queries with the same columns, combined with `UNION`. A head of department might also be assigned to the project."
---
Build the roster for **project 4**: everyone **assigned** to it, plus the **head** of the project's department (the employee whose `employee_id` equals the department id, e.g. employee 2 for department 2). Return `employee_id` and `job_title`, each person once, sorted by `employee_id`.

```sql solution
SELECT e.employee_id, e.job_title
FROM assignments a JOIN employees e ON e.employee_id = a.employee_id
WHERE a.project_id = 4
UNION
SELECT e.employee_id, e.job_title
FROM projects p JOIN employees e ON e.employee_id = p.department_id
WHERE p.project_id = 4
ORDER BY employee_id;
```

```sql wrong
SELECT e.employee_id, e.job_title
FROM assignments a JOIN employees e ON e.employee_id = a.employee_id
WHERE a.project_id = 4
ORDER BY employee_id;
```
