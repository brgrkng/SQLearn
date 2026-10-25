---
title: Hired alongside the boss
kind: problem
difficulty: easy
dataset: hr
ordered: true
---
Return the `employee_id` and `hire_date` of employees hired in the **same calendar month and year** as their direct manager, with the manager's `employee_id`. Sort by `employee_id`.

```sql solution
SELECT e.employee_id, e.hire_date, m.employee_id AS manager_id
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE date_trunc('month', e.hire_date) = date_trunc('month', m.hire_date)
ORDER BY e.employee_id;
```

```sql wrong
SELECT e.employee_id, e.hire_date, m.employee_id AS manager_id
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE extract(month FROM e.hire_date) = extract(month FROM m.hire_date)
ORDER BY e.employee_id;
```
