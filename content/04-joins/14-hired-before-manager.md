---
title: Hired before their manager
kind: drill
dataset: hr
ordered: true
---
Return the `employee_id` and `hire_date` of every employee who was **hired before their manager**, along with the manager's `employee_id` and `hire_date`. Sort by `employee_id`.

```sql solution
SELECT e.employee_id, e.hire_date, m.employee_id AS manager_id, m.hire_date AS manager_hired
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE e.hire_date < m.hire_date
ORDER BY e.employee_id;
```

```sql wrong
SELECT e.employee_id, e.hire_date, m.employee_id AS manager_id, m.hire_date AS manager_hired
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE e.hire_date > m.hire_date
ORDER BY e.employee_id;
```
