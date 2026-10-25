---
title: A department report view
kind: test
dataset: hr
---
Create a view `department_report` with one row per department (including departments with no current staff): `department_id`, `name`, `headcount` (current employees) and `payroll` (sum of their salaries, **0** when none).

```sql solution
CREATE VIEW department_report AS
SELECT d.department_id, d.name, count(e.employee_id) AS headcount, coalesce(sum(e.salary), 0) AS payroll
FROM departments d
LEFT JOIN employees e ON e.department_id = d.department_id AND e.termination_date IS NULL
GROUP BY d.department_id, d.name;
```

```sql check Report contents
SELECT department_id, name, headcount, payroll FROM department_report;
```

```sql check It updates as data changes
UPDATE employees SET termination_date = '2026-01-31' WHERE employee_id = 34;
SELECT headcount, payroll FROM department_report WHERE department_id = 2;
```

```sql check A department whose staff all left still appears, with zeros
UPDATE employees SET termination_date = '2026-02-28' WHERE department_id = 9 AND termination_date IS NULL;
SELECT department_id, headcount, payroll FROM department_report WHERE department_id = 9;
```

```sql wrong
CREATE VIEW department_report AS
SELECT d.department_id, d.name, count(e.employee_id) AS headcount, coalesce(sum(e.salary), 0) AS payroll
FROM departments d
LEFT JOIN employees e ON e.department_id = d.department_id
WHERE e.termination_date IS NULL
GROUP BY d.department_id, d.name;
```

```sql wrong
CREATE MATERIALIZED VIEW department_report AS
SELECT d.department_id, d.name, count(e.employee_id) AS headcount, coalesce(sum(e.salary), 0) AS payroll
FROM departments d
LEFT JOIN employees e ON e.department_id = d.department_id AND e.termination_date IS NULL
GROUP BY d.department_id, d.name;
```
