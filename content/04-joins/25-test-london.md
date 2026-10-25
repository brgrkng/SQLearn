---
title: The London office
kind: test
dataset: hr
ordered: true
---
Return the `employee_id`, `first_name`, `last_name` and department `name` of **current** employees based in **London** (by department location). Sort by `employee_id`.

```sql solution
SELECT e.employee_id, e.first_name, e.last_name, d.name
FROM employees e
JOIN departments d ON d.department_id = e.department_id
WHERE d.location = 'London' AND e.termination_date IS NULL
ORDER BY e.employee_id;
```

```sql wrong
SELECT e.employee_id, e.first_name, e.last_name, d.name
FROM employees e
JOIN departments d ON d.department_id = e.department_id
WHERE d.location = 'London'
ORDER BY e.employee_id;
```
