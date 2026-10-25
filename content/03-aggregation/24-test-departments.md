---
title: Large departments
kind: test
dataset: hr
ordered: true
---
For each department with **more than 20 current employees** (no termination date), return `department_id`, the current headcount, and the average salary of current employees rounded to the nearest whole number. Largest headcount first.

```sql solution
SELECT department_id, count(*) AS headcount, round(avg(salary)) AS avg_salary
FROM employees
WHERE termination_date IS NULL
GROUP BY department_id
HAVING count(*) > 20
ORDER BY headcount DESC;
```

```sql wrong
SELECT department_id, count(*) AS headcount, round(avg(salary)) AS avg_salary
FROM employees
GROUP BY department_id
HAVING count(*) > 20
ORDER BY headcount DESC;
```
