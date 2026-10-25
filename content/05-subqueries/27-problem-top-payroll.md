---
title: Biggest payroll
kind: problem
difficulty: hard
dataset: hr
hints:
  - Sum salaries per department, then keep the department(s) whose total equals the largest total.
  - "`HAVING sum(salary) = (SELECT max(total) FROM (SELECT sum(salary) AS total ... GROUP BY ...) t)`"
---
Return the `name` of the department with the **highest total salary of current employees**, and that total. If departments tie, return all of them.

```sql solution
SELECT d.name, sum(e.salary) AS payroll
FROM departments d
JOIN employees e ON e.department_id = d.department_id
WHERE e.termination_date IS NULL
GROUP BY d.name
HAVING sum(e.salary) = (SELECT max(total)
                        FROM (SELECT sum(salary) AS total FROM employees
                              WHERE termination_date IS NULL GROUP BY department_id) t);
```

```sql wrong
SELECT d.name, sum(e.salary) AS payroll
FROM departments d
JOIN employees e ON e.department_id = d.department_id
GROUP BY d.name
ORDER BY payroll DESC
LIMIT 1;
```
