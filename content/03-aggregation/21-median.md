---
title: Median salary by department
kind: drill
dataset: hr
ordered: true
hints:
  - "`percentile_cont(0.5) WITHIN GROUP (ORDER BY salary)`"
---
For **current** employees (no termination date), return each `department_id`, its headcount, and its **median** salary. Sort by `department_id`.

```sql starter
SELECT department_id, count(*), avg(salary)
FROM employees
WHERE termination_date IS NULL
GROUP BY department_id
ORDER BY department_id;
```

```sql solution
SELECT department_id, count(*) AS headcount,
       percentile_cont(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary
FROM employees
WHERE termination_date IS NULL
GROUP BY department_id
ORDER BY department_id;
```

```sql wrong
SELECT department_id, count(*) AS headcount,
       percentile_cont(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary
FROM employees
GROUP BY department_id
ORDER BY department_id;
```
