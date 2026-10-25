---
title: Org levels in Support
kind: test
dataset: hr
ordered: true
---
The CEO is at level 0, the department heads at level 1, and so on. For every employee in department **7** (*Support*), return `employee_id` and their **level**. Sort by level, then `employee_id`.

```sql solution
WITH RECURSIVE levels AS (
  SELECT employee_id, department_id, 0 AS level FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.department_id, l.level + 1
  FROM employees e JOIN levels l ON e.manager_id = l.employee_id
)
SELECT employee_id, level FROM levels WHERE department_id = 7 ORDER BY level, employee_id;
```

```sql wrong
WITH RECURSIVE levels AS (
  SELECT employee_id, department_id, 0 AS level FROM employees WHERE employee_id = 7
  UNION ALL
  SELECT e.employee_id, e.department_id, l.level + 1
  FROM employees e JOIN levels l ON e.manager_id = l.employee_id
)
SELECT employee_id, level FROM levels WHERE department_id = 7 ORDER BY level, employee_id;
```
