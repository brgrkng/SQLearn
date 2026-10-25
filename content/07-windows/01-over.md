---
title: OVER and PARTITION BY
kind: lesson
dataset: hr
---
Any aggregate becomes a window function when you add `OVER (...)`. The empty window `OVER ()` is every row of the result:

```sql
SELECT employee_id, department_id, salary,
       round(avg(salary) OVER ()) AS company_avg,
       count(*) OVER ()           AS headcount
FROM employees
WHERE termination_date IS NULL
ORDER BY employee_id
LIMIT 5;
```

Every row keeps its own columns and gains the aggregate across the window. Compare that with `GROUP BY`, which would return a single row.

## PARTITION BY

`PARTITION BY` splits the window into groups, much as `GROUP BY` does, but without collapsing the rows:

```sql
SELECT employee_id, department_id, salary,
       round(avg(salary) OVER (PARTITION BY department_id)) AS dept_avg,
       salary - round(avg(salary) OVER (PARTITION BY department_id)) AS vs_dept
FROM employees
WHERE termination_date IS NULL AND department_id = 5
ORDER BY salary DESC;
```

## Shares of a total

Dividing a value by a windowed sum gives its share of the total:

```sql
SELECT department_id, count(*) AS headcount,
       round(100.0 * count(*) / sum(count(*)) OVER (), 1) AS pct_of_company
FROM employees
WHERE termination_date IS NULL
GROUP BY department_id
ORDER BY department_id;
```

`sum(count(*)) OVER ()` looks odd, but read it inside out: `count(*)` is the group's aggregate, and `sum(...) OVER ()` adds those counts across all the grouped rows. **Window functions run after `GROUP BY`**, so they can work on aggregates.

## Where window functions are allowed

The logical order is `FROM → WHERE → GROUP BY → HAVING → window functions → SELECT → ORDER BY`. As a result:

- You **can't** use a window function in `WHERE` or `HAVING`. To filter on one, compute it in a CTE or subquery and filter outside.
- You **can** use one in `ORDER BY`.

```sql
WITH ranked AS (
  SELECT employee_id, department_id, salary,
         avg(salary) OVER (PARTITION BY department_id) AS dept_avg
  FROM employees
  WHERE termination_date IS NULL
)
SELECT employee_id, department_id, salary, round(dept_avg) AS dept_avg
FROM ranked
WHERE salary > 1.5 * dept_avg
ORDER BY department_id, salary DESC;
```

> **Dialect note.** Window functions are standard SQL and supported by PostgreSQL, SQL Server, Oracle, SQLite (3.25+) and MySQL (8.0+). MySQL 5.7 and earlier have none, which is why you'll find convoluted variable-based workarounds in old MySQL answers online.
