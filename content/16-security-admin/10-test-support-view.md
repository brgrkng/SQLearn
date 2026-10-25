---
title: Support sees bands, not salaries
kind: test
dataset: hr
---
Create a role `support` (no login) and a view `staff_overview` showing each **current** employee's `employee_id`, `first_name`, `last_name` and a `pay_band`: `A` under 60,000, `B` under 100,000, `C` otherwise. Grant `support` read access to the **view only**, not to `employees`.

```sql solution
CREATE ROLE support NOLOGIN;
CREATE VIEW staff_overview AS
SELECT employee_id, first_name, last_name,
       CASE WHEN salary < 60000 THEN 'A' WHEN salary < 100000 THEN 'B' ELSE 'C' END AS pay_band
FROM employees
WHERE termination_date IS NULL;
GRANT SELECT ON staff_overview TO support;
```

```sql check Support can read the overview
SET ROLE support;
SELECT pay_band, count(*) FROM staff_overview GROUP BY pay_band;
```

```sql check Support can't read salaries directly
SET ROLE support;
SELECT count(*) FROM employees;
```

```sql wrong
CREATE ROLE support NOLOGIN;
CREATE VIEW staff_overview AS
SELECT employee_id, first_name, last_name,
       CASE WHEN salary < 60000 THEN 'A' WHEN salary < 100000 THEN 'B' ELSE 'C' END AS pay_band
FROM employees
WHERE termination_date IS NULL;
GRANT SELECT ON staff_overview, employees TO support;
```
