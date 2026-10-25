---
title: The current staff directory
kind: drill
dataset: hr
hints:
  - The view hides former employees and the salary column.
---
Create a view `directory` that shows **current** employees only (no termination date), with `employee_id`, `first_name`, `last_name`, `email` and their department's `name` as `department`, and **no salary information**.

```sql solution
CREATE VIEW directory AS
SELECT e.employee_id, e.first_name, e.last_name, e.email, d.name AS department
FROM employees e JOIN departments d ON d.department_id = e.department_id
WHERE e.termination_date IS NULL;
```

```sql check The directory's columns
SELECT column_name FROM information_schema.columns WHERE table_name = 'directory';
```

```sql check Contents
SELECT employee_id, department FROM directory;
```

```sql wrong
CREATE VIEW directory AS
SELECT e.employee_id, e.first_name, e.last_name, e.email, d.name AS department
FROM employees e JOIN departments d ON d.department_id = e.department_id;
```

```sql wrong
CREATE VIEW directory AS
SELECT e.employee_id, e.first_name, e.last_name, e.email, d.name AS department, e.salary
FROM employees e JOIN departments d ON d.department_id = e.department_id
WHERE e.termination_date IS NULL;
```
