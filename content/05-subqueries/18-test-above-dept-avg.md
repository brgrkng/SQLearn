---
title: Above the department average
kind: test
dataset: hr
ordered: true
---
Return the `employee_id`, `department_id` and `salary` of **current** employees who earn **more than the average salary of current employees in their department**. Sort by `department_id`, then `salary` descending, then `employee_id`.

```sql solution
SELECT e.employee_id, e.department_id, e.salary
FROM employees e
WHERE e.termination_date IS NULL
  AND e.salary > (SELECT avg(e2.salary) FROM employees e2
                  WHERE e2.department_id = e.department_id AND e2.termination_date IS NULL)
ORDER BY e.department_id, e.salary DESC, e.employee_id;
```

```sql wrong
SELECT e.employee_id, e.department_id, e.salary
FROM employees e
WHERE e.termination_date IS NULL
  AND e.salary > (SELECT avg(e2.salary) FROM employees e2 WHERE e2.termination_date IS NULL)
ORDER BY e.department_id, e.salary DESC, e.employee_id;
```
