---
title: Chain of command
kind: drill
dataset: hr
ordered: true
hints:
  - "Anchor: employee 285. Recursive step: join `employees` to the previous row's `manager_id`."
  - Track the number of steps taken so you can sort by it.
---
Return the full chain of command above **employee 285**, starting with employee 285 and ending with the CEO: each person's `employee_id` and `job_title`, in order.

```sql solution
WITH RECURSIVE chain AS (
  SELECT employee_id, manager_id, job_title, 0 AS depth FROM employees WHERE employee_id = 285
  UNION ALL
  SELECT e.employee_id, e.manager_id, e.job_title, c.depth + 1
  FROM employees e JOIN chain c ON e.employee_id = c.manager_id
)
SELECT employee_id, job_title FROM chain ORDER BY depth;
```

```sql wrong
WITH RECURSIVE chain AS (
  SELECT employee_id, manager_id, job_title, 0 AS depth FROM employees WHERE employee_id = 285
  UNION ALL
  SELECT e.employee_id, e.manager_id, e.job_title, c.depth + 1
  FROM employees e JOIN chain c ON e.employee_id = c.manager_id
)
SELECT employee_id, job_title FROM chain ORDER BY depth DESC;
```
