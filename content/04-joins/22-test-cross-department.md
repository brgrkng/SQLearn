---
title: Managed from another department
kind: test
dataset: hr
ordered: true
---
Return the `employee_id` and `department_id` of employees whose **manager works in a different department**, with the manager's `department_id`. Sort by `employee_id`.

```sql solution
SELECT e.employee_id, e.department_id, m.department_id AS manager_department
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE e.department_id <> m.department_id
ORDER BY e.employee_id;
```

```sql wrong
SELECT e.employee_id, e.department_id, m.department_id AS manager_department
FROM employees e
LEFT JOIN employees m ON m.employee_id = e.manager_id
WHERE e.department_id IS DISTINCT FROM m.department_id
ORDER BY e.employee_id;
```
