---
title: Self-joins, cross joins and non-equi joins
kind: lesson
dataset: hr
---
## Joining a table to itself

`employees.manager_id` points at another row of `employees`. To show each person next to their manager, join the table to itself under two aliases:

```sql
SELECT e.employee_id, e.first_name || ' ' || e.last_name AS employee,
       m.first_name || ' ' || m.last_name AS manager
FROM employees e
LEFT JOIN employees m ON m.employee_id = e.manager_id
WHERE e.employee_id <= 12
ORDER BY e.employee_id;
```

`LEFT JOIN` keeps the CEO, who has no manager. Once both copies are in the query you can compare them: people paid more than their manager, or hired before them:

```sql
SELECT e.employee_id, e.job_title, e.salary, m.employee_id AS manager_id, m.salary AS manager_salary
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE e.salary > m.salary;
```

Self-joins only go a fixed number of levels deep: one join per level. To walk a hierarchy of any depth you need a recursive CTE (Module 6).

## Cross joins

`CROSS JOIN` pairs every row on the left with every row on the right, with no condition. Accidental cross joins are a classic disaster (a 50,000-row table crossed with itself is 2.5 billion rows), but deliberate ones are useful for building grids:

```sql
SELECT d.name, q.quarter
FROM departments d
CROSS JOIN (VALUES ('Q1'), ('Q2'), ('Q3'), ('Q4')) AS q(quarter)
WHERE d.department_id <= 2;
```

A grid like this, left-joined to the facts, gives a report with a row for every department and quarter, even the empty ones.

## Non-equi joins

A join condition can be any boolean expression, not just `=`. Matching a value against ranges is common:

```sql
SELECT b.band, count(*) AS employees
FROM employees e
JOIN (VALUES ('under 60k', 0, 60000), ('60k–100k', 60000, 100000), ('100k+', 100000, 1e9))
     AS b(band, lo, hi)
  ON e.salary >= b.lo AND e.salary < b.hi
GROUP BY b.band, b.lo
ORDER BY b.lo;
```

Or matching events to periods: which projects were running on the day each person was hired?

```sql
SELECT e.employee_id, e.hire_date, p.name
FROM employees e
JOIN projects p ON e.hire_date BETWEEN p.start_date AND coalesce(p.end_date, date '9999-12-31')
WHERE e.employee_id BETWEEN 250 AND 255
ORDER BY e.employee_id, p.name;
```

> **Dialect note.** Self, cross and non-equi joins are plain standard SQL. SQL Server and Oracle also offer `CROSS APPLY` / `OUTER APPLY`, which correspond to PostgreSQL's `LATERAL` joins (Module 5).
