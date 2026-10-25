---
title: Top five salaries per department
kind: problem
difficulty: medium
dataset: hr
ordered: true
hints:
  - "\"Top five salaries\" means the five highest *distinct* salary values, and everyone who earns them."
  - "`dense_rank() OVER (PARTITION BY department_id ORDER BY salary DESC)`"
---
For each department, return every **current** employee whose salary is among the **five highest distinct salaries** in their department: department `name`, `employee_id` and `salary`. Sort by department name, salary descending, then `employee_id`.

```sql solution
WITH ranked AS (
  SELECT e.department_id, e.employee_id, e.salary,
         dense_rank() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS r
  FROM employees e
  WHERE e.termination_date IS NULL
)
SELECT d.name, r.employee_id, r.salary
FROM ranked r JOIN departments d USING (department_id)
WHERE r.r <= 5
ORDER BY d.name, r.salary DESC, r.employee_id;
```

```sql wrong
WITH ranked AS (
  SELECT e.department_id, e.employee_id, e.salary,
         row_number() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC, e.employee_id) AS r
  FROM employees e
  WHERE e.termination_date IS NULL
)
SELECT d.name, r.employee_id, r.salary
FROM ranked r JOIN departments d USING (department_id)
WHERE r.r <= 5
ORDER BY d.name, r.salary DESC, r.employee_id;
```
