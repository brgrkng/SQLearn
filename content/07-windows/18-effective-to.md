---
title: Salary periods
kind: drill
dataset: hr
ordered: true
hints:
  - "The end of one salary period is the day before the next one starts: `lead(effective_from) OVER (...) - 1`."
  - Partition by employee.
---
`salary_history` stores when each salary **started**. For employees **34 to 36**, return `employee_id`, `salary`, `effective_from`, and `effective_to`: the day **before** that employee's next salary started (NULL for their current salary). Sort by employee, then `effective_from`.

```sql solution
SELECT employee_id, salary, effective_from,
       lead(effective_from) OVER (PARTITION BY employee_id ORDER BY effective_from) - 1 AS effective_to
FROM salary_history
WHERE employee_id BETWEEN 34 AND 36
ORDER BY employee_id, effective_from;
```

```sql wrong
SELECT employee_id, salary, effective_from,
       lead(effective_from) OVER (ORDER BY employee_id, effective_from) - 1 AS effective_to
FROM salary_history
WHERE employee_id BETWEEN 34 AND 36
ORDER BY employee_id, effective_from;
```
