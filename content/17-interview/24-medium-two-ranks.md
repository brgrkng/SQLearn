---
title: Rank in the company and the team
kind: problem
difficulty: medium
dataset: hr
ordered: true
---
For **current** employees in department **6** (*People*), return `employee_id`, `salary`, their salary rank **within the department** and their salary rank **across the whole company** (current employees, highest salary = 1, tied salaries share a rank and the next rank skips). Sort by department rank, then `employee_id`.

```sql solution
WITH ranked AS (
  SELECT employee_id, department_id, salary,
         rank() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dept_rank,
         rank() OVER (ORDER BY salary DESC) AS company_rank
  FROM employees
  WHERE termination_date IS NULL
)
SELECT employee_id, salary, dept_rank, company_rank
FROM ranked
WHERE department_id = 6
ORDER BY dept_rank, employee_id;
```

```sql wrong
SELECT employee_id, salary,
       rank() OVER (ORDER BY salary DESC) AS dept_rank,
       rank() OVER (ORDER BY salary DESC) AS company_rank
FROM employees
WHERE termination_date IS NULL AND department_id = 6
ORDER BY dept_rank, employee_id;
```

## Explanation
Window functions run **after** `WHERE`. Filtering to department 6 first means the "company" rank only ranks the People department. Compute both ranks over all current employees in a CTE, then filter.
