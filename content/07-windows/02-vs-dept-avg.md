---
title: Salary against the department
kind: drill
dataset: hr
hints:
  - "`avg(salary) OVER (PARTITION BY department_id)`"
---
For **current** employees in department **4** (*Marketing*), return `employee_id`, `salary`, and the **average salary of current employees in their department**, rounded to the nearest whole number, on every row.

```sql starter
SELECT employee_id, salary, avg(salary)
FROM employees
WHERE termination_date IS NULL AND department_id = 4
GROUP BY employee_id;
```

```sql solution
SELECT employee_id, salary, round(avg(salary) OVER (PARTITION BY department_id)) AS dept_avg
FROM employees
WHERE termination_date IS NULL AND department_id = 4;
```

```sql wrong
SELECT employee_id, salary, round(avg(salary) OVER ()) AS dept_avg
FROM employees
WHERE termination_date IS NULL;
```
