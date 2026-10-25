---
title: Steady raises
kind: problem
difficulty: hard
dataset: hr
ordered: true
hints:
  - "`lag(salary)` within each employee's history gives the previous salary."
  - "Employees with at least two raises whose **every** raise was at least 5.25%: `bool_and(...)` over their raise rows."
---
Find employees with **at least 3 salary records** whose **every** raise (each `salary_history` row compared with the previous one) was **at least 5.25%**. Return `employee_id`, the number of raises and the smallest raise percentage, rounded to 2 decimals. Sort by `employee_id`. Only consider employees **34 to 120**.

```sql solution
WITH h AS (
  SELECT employee_id, salary,
         lag(salary) OVER (PARTITION BY employee_id ORDER BY effective_from) AS previous
  FROM salary_history
  WHERE employee_id BETWEEN 34 AND 120
), raises AS (
  SELECT employee_id, 100 * (salary - previous) / previous AS pct FROM h WHERE previous IS NOT NULL
)
SELECT employee_id, count(*) AS raises, round(min(pct), 2) AS smallest_raise_pct
FROM raises
GROUP BY employee_id
HAVING count(*) >= 2 AND bool_and(pct >= 5.25)
ORDER BY employee_id;
```

```sql wrong
WITH h AS (
  SELECT employee_id, salary,
         lag(salary) OVER (PARTITION BY employee_id ORDER BY effective_from) AS previous
  FROM salary_history
  WHERE employee_id BETWEEN 34 AND 120
), raises AS (
  SELECT employee_id, 100 * (salary - previous) / previous AS pct FROM h WHERE previous IS NOT NULL
)
SELECT employee_id, count(*) AS raises, round(min(pct), 2) AS smallest_raise_pct
FROM raises
GROUP BY employee_id
HAVING count(*) >= 2 AND avg(pct) >= 5.25
ORDER BY employee_id;
```
