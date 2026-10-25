---
title: Top earner per department
kind: drill
dataset: hr
ordered: true
hints:
  - "`row_number() OVER (PARTITION BY department_id ORDER BY salary DESC, employee_id)` in a CTE, then keep `rn = 1`."
---
For each department, return the **highest-paid current employee** (ties broken by the lower `employee_id`): `department_id`, `employee_id` and `salary`. Sort by `department_id`.

```sql starter
SELECT department_id, employee_id, max(salary)
FROM employees
WHERE termination_date IS NULL
GROUP BY department_id;
```

```sql solution
WITH ranked AS (
  SELECT department_id, employee_id, salary,
         row_number() OVER (PARTITION BY department_id ORDER BY salary DESC, employee_id) AS rn
  FROM employees
  WHERE termination_date IS NULL
)
SELECT department_id, employee_id, salary FROM ranked WHERE rn = 1 ORDER BY department_id;
```
