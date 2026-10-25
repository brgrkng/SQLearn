---
title: Support pay bands
kind: test
dataset: hr
---
For **current** employees (no termination date) in department **7** (*Support*), return `employee_id`, `salary` and a pay band: `A` below 50,000, `B` from 50,000 to 69,999.99, `C` from 70,000 to 99,999.99 and `D` from 100,000.

```sql solution
SELECT employee_id, salary,
       CASE WHEN salary < 50000 THEN 'A' WHEN salary < 70000 THEN 'B' WHEN salary < 100000 THEN 'C' ELSE 'D' END AS band
FROM employees
WHERE department_id = 7 AND termination_date IS NULL;
```

```sql wrong
SELECT employee_id, salary,
       CASE WHEN salary < 50000 THEN 'A' WHEN salary < 70000 THEN 'B' WHEN salary < 100000 THEN 'C' ELSE 'D' END AS band
FROM employees
WHERE department_id = 7;
```

```sql wrong
SELECT employee_id, salary,
       CASE WHEN salary < 50000 THEN 'A' WHEN salary < 70000 THEN 'B' WHEN salary < 100000 THEN 'C' END AS band
FROM employees
WHERE department_id = 7 AND termination_date IS NULL;
```
