---
title: LATERAL joins
kind: lesson
dataset: hr
---
A subquery in `FROM` normally can't see the other tables in the same `FROM` clause. Adding `LATERAL` lets it refer to columns of the tables to its left. Conceptually, it runs once for each row on the left, like a correlated subquery that can return **many rows and many columns**.

The classic use is **top-N per group**. For example, the two highest-paid current employees in each department:

```sql
SELECT d.name, top.first_name, top.last_name, top.salary
FROM departments d
CROSS JOIN LATERAL (
  SELECT e.first_name, e.last_name, e.salary
  FROM employees e
  WHERE e.department_id = d.department_id AND e.termination_date IS NULL
  ORDER BY e.salary DESC
  LIMIT 2
) AS top
ORDER BY d.name, top.salary DESC;
```

`CROSS JOIN LATERAL` drops departments where the subquery returns nothing (Research). `LEFT JOIN LATERAL (...) ON true` keeps them, with NULLs:

```sql
SELECT d.name, latest.first_name, latest.hire_date
FROM departments d
LEFT JOIN LATERAL (
  SELECT e.first_name, e.hire_date
  FROM employees e
  WHERE e.department_id = d.department_id
  ORDER BY e.hire_date DESC
  LIMIT 1
) AS latest ON true
ORDER BY d.name;
```

With an index on the subquery's filter and sort columns, for example `(department_id, salary)`, each lateral lookup reads just a few index entries. That makes LATERAL the fastest way to get "the latest N per group" from a very large table.

Set-returning functions in `FROM` are implicitly lateral, which is handy with `generate_series` or `unnest`:

```sql
SELECT p.name, d::date AS day
FROM projects p, generate_series(p.start_date, p.start_date + 2, interval '1 day') AS d
WHERE p.project_id = 1;
```

> **Dialect note.** SQL Server and Oracle (12c+) call this `CROSS APPLY` / `OUTER APPLY`. MySQL supports `LATERAL` from 8.0.14. You'll see window functions (Module 7) used for top-N per group as well. LATERAL is often faster when the groups are large and only a few rows from each are needed.
