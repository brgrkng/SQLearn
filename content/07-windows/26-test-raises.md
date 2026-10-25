---
title: Raise history
kind: test
dataset: hr
ordered: true
---
For **employee 40**, return every `salary_history` row's `effective_from`, `salary`, and the **percentage raise** compared with the previous salary, rounded to 1 decimal place (NULL for the first row). In date order.

```sql solution
SELECT effective_from, salary,
       round(100 * (salary - lag(salary) OVER (ORDER BY effective_from)) / lag(salary) OVER (ORDER BY effective_from), 1) AS raise_pct
FROM salary_history
WHERE employee_id = 40
ORDER BY effective_from;
```

```sql wrong
SELECT effective_from, salary,
       round(100 * (salary - first_value(salary) OVER (ORDER BY effective_from)) / first_value(salary) OVER (ORDER BY effective_from), 1) AS raise_pct
FROM salary_history
WHERE employee_id = 40
ORDER BY effective_from;
```
