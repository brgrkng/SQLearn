---
title: Top tenth of each department
kind: test
dataset: hr
ordered: true
---
Among **current** employees, return those whose salary is in the **top 10% of their department**, meaning a `percent_rank()` (by salary, ascending, within the department) of **0.9 or more**. Return `department_id`, `employee_id` and `salary`, sorted by `department_id`, then salary descending, then `employee_id`.

```sql solution
WITH r AS (
  SELECT department_id, employee_id, salary,
         percent_rank() OVER (PARTITION BY department_id ORDER BY salary) AS pr
  FROM employees
  WHERE termination_date IS NULL
)
SELECT department_id, employee_id, salary FROM r WHERE pr >= 0.9
ORDER BY department_id, salary DESC, employee_id;
```

```sql wrong
WITH r AS (
  SELECT department_id, employee_id, salary,
         percent_rank() OVER (ORDER BY salary) AS pr
  FROM employees
  WHERE termination_date IS NULL
)
SELECT department_id, employee_id, salary FROM r WHERE pr >= 0.9
ORDER BY department_id, salary DESC, employee_id;
```
