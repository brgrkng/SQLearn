---
title: Headcount with a total
kind: drill
dataset: hr
ordered: true
hints:
  - "`GROUP BY ROLLUP (department_id)` adds a grand-total row with a NULL department."
---
Return each `department_id` with its number of **current** employees, plus a final **grand total** row (where `department_id` is NULL). Sort by `department_id`, with the total row last.

```sql solution
SELECT department_id, count(*) AS headcount
FROM employees
WHERE termination_date IS NULL
GROUP BY ROLLUP (department_id)
ORDER BY department_id NULLS LAST;
```

```sql wrong
SELECT department_id, count(*) AS headcount
FROM employees
WHERE termination_date IS NULL
GROUP BY department_id
ORDER BY department_id;
```
