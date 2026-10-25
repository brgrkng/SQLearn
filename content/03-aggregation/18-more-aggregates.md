---
title: Lists, booleans and medians
kind: lesson
dataset: hr
---
## Collecting values: string_agg and array_agg

`string_agg(expr, separator)` joins a group's values into one string, and `array_agg` builds an array. Both accept an `ORDER BY` *inside* the call:

```sql
SELECT department_id,
       string_agg(first_name, ', ' ORDER BY first_name) AS names,
       array_agg(employee_id ORDER BY employee_id)       AS ids
FROM employees
WHERE manager_id = 2
GROUP BY department_id;
```

## Booleans: bool_and and bool_or

`bool_and` is true if the condition holds for *every* row in the group, and `bool_or` if it holds for *any* row. They're perfect for "all" and "any" questions:

```sql
SELECT department_id,
       bool_or(termination_date IS NOT NULL)  AS has_had_leavers,
       bool_and(salary >= 50000)              AS everyone_earns_50k
FROM employees
GROUP BY department_id
ORDER BY department_id;
```

## Medians and percentiles

The average is easily dragged around by outliers: one CEO salary moves it a lot. The **median** (the middle value) doesn't move. In SQL it's an *ordered-set aggregate*, written with `WITHIN GROUP`:

```sql
SELECT department_id,
       round(avg(salary))                                        AS mean,
       percentile_cont(0.5) WITHIN GROUP (ORDER BY salary)      AS median,
       percentile_disc(0.9) WITHIN GROUP (ORDER BY salary)      AS p90,
       mode() WITHIN GROUP (ORDER BY job_title)                 AS most_common_title
FROM employees
GROUP BY department_id
ORDER BY department_id;
```

- `percentile_cont` interpolates between values. The median of 1, 2, 3, 4 is 2.5.
- `percentile_disc` returns an actual value from the data.
- `mode()` returns the most frequent value.

Also available: `stddev`, `variance`, `corr(y, x)` and `regr_slope(y, x)`, for statistics without leaving SQL.

> **Dialect note.** `string_agg` is called `GROUP_CONCAT` in MySQL and `LISTAGG` in Oracle. SQL Server has `STRING_AGG` (2017+), with ordering via `WITHIN GROUP (ORDER BY ...)`. `percentile_cont` exists in Oracle and SQL Server, but in SQL Server it's a *window* function (`OVER (PARTITION BY ...)`), not an aggregate. MySQL has no built-in median.
