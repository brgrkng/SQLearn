---
title: Hide the salary column
kind: drill
dataset: hr
hints:
  - "Grant on specific columns: `GRANT SELECT (employee_id, first_name, ...) ON employees TO directory_reader;`"
---
Create a role `directory_reader` (no login) that can read `employees.employee_id`, `first_name`, `last_name`, `email` and `department_id`, but **not** `salary` or any other column.

```sql solution
CREATE ROLE directory_reader NOLOGIN;
GRANT SELECT (employee_id, first_name, last_name, email, department_id) ON employees TO directory_reader;
```

```sql check Allowed columns are readable
SET ROLE directory_reader;
SELECT count(*), count(DISTINCT department_id) FROM (SELECT employee_id, first_name, last_name, email, department_id FROM employees) e;
```

```sql check Salaries are not
SET ROLE directory_reader;
SELECT max(salary) FROM employees;
```

```sql check SELECT * is refused too
SET ROLE directory_reader;
SELECT * FROM employees LIMIT 1;
```

```sql wrong
CREATE ROLE directory_reader NOLOGIN;
GRANT SELECT ON employees TO directory_reader;
```
