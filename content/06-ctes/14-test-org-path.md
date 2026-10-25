---
title: Reporting lines in Legal
kind: test
dataset: hr
ordered: true
---
For employees in department **9** (*Legal*), return `employee_id` and their reporting line as **last names from the CEO down to them**, separated by ` > ` (e.g. `Okonkwo > Iyer > Bauer`). Sort by `employee_id`.

```sql solution
WITH RECURSIVE paths AS (
  SELECT employee_id, department_id, last_name::text AS path FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.department_id, p.path || ' > ' || e.last_name
  FROM employees e JOIN paths p ON e.manager_id = p.employee_id
)
SELECT employee_id, path FROM paths WHERE department_id = 9 ORDER BY employee_id;
```

```sql wrong
WITH RECURSIVE paths AS (
  SELECT employee_id, department_id, last_name::text AS path FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.department_id, e.last_name || ' > ' || p.path
  FROM employees e JOIN paths p ON e.manager_id = p.employee_id
)
SELECT employee_id, path FROM paths WHERE department_id = 9 ORDER BY employee_id;
```
