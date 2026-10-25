---
title: Starting salary
kind: drill
dataset: hr
ordered: true
hints:
  - "`first_value(salary) OVER (PARTITION BY employee_id ORDER BY effective_from)` is the starting salary on every row."
  - Keep only each employee's latest row, or use `DISTINCT ON`.
---
For **current** employees in department **9** (*Legal*), return `employee_id`, their **starting salary** (earliest `salary_history` row), their **current salary**, and the total percentage increase rounded to 1 decimal place. Sort by `employee_id`.

```sql solution
WITH h AS (
  SELECT sh.employee_id, sh.salary, sh.effective_from,
         first_value(sh.salary) OVER (PARTITION BY sh.employee_id ORDER BY sh.effective_from) AS starting,
         row_number() OVER (PARTITION BY sh.employee_id ORDER BY sh.effective_from DESC) AS rn
  FROM salary_history sh
  JOIN employees e ON e.employee_id = sh.employee_id
  WHERE e.department_id = 9 AND e.termination_date IS NULL
)
SELECT employee_id, starting, salary AS current, round(100 * (salary - starting) / starting, 1) AS increase_pct
FROM h
WHERE rn = 1
ORDER BY employee_id;
```

```sql wrong
WITH h AS (
  SELECT sh.employee_id, sh.salary, sh.effective_from,
         last_value(sh.salary) OVER (PARTITION BY sh.employee_id ORDER BY sh.effective_from) AS starting,
         row_number() OVER (PARTITION BY sh.employee_id ORDER BY sh.effective_from DESC) AS rn
  FROM salary_history sh
  JOIN employees e ON e.employee_id = sh.employee_id
  WHERE e.department_id = 9 AND e.termination_date IS NULL
)
SELECT employee_id, starting, salary AS current, round(100 * (salary - starting) / starting, 1) AS increase_pct
FROM h
WHERE rn = 1
ORDER BY employee_id;
```
