---
title: Who's the boss?
kind: drill
dataset: hr
hints:
  - "Join `employees` to itself: `employees e JOIN employees m ON m.employee_id = e.manager_id`."
---
For employees in department **6** (*People*), return `employee_id`, their `last_name`, and their **manager's** `last_name`.

```sql starter
SELECT employee_id, last_name, manager_id
FROM employees
WHERE department_id = 6;
```

```sql solution
SELECT e.employee_id, e.last_name, m.last_name AS manager
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE e.department_id = 6;
```

```sql wrong
SELECT e.employee_id, e.last_name, m.last_name AS manager
FROM employees e
JOIN employees m ON m.manager_id = e.employee_id
WHERE e.department_id = 6;
```
