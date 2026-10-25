---
title: Out-earning the manager
kind: problem
difficulty: easy
dataset: hr
ordered: true
---
Return the `employee_id`, `salary` and their manager's salary for every employee who earns **more than their direct manager**. Sort by `employee_id`.

```sql solution
SELECT e.employee_id, e.salary, m.salary AS manager_salary
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE e.salary > m.salary
ORDER BY e.employee_id;
```

```sql wrong
SELECT e.employee_id, e.salary, m.salary AS manager_salary
FROM employees e
LEFT JOIN employees m ON m.employee_id = e.manager_id
WHERE e.salary > coalesce(m.salary, 0)
ORDER BY e.employee_id;
```

```sql wrong
SELECT e.employee_id, e.salary, m.salary AS manager_salary
FROM employees e
JOIN employees m ON m.manager_id = e.employee_id
WHERE e.salary > m.salary
ORDER BY e.employee_id;
```
