---
title: Ranking and top-N per group
kind: lesson
dataset: hr
---
Ranking functions number the rows of each partition in the order given by `ORDER BY` inside `OVER`:

```sql
SELECT employee_id, salary,
       row_number() OVER (ORDER BY salary DESC) AS row_number,
       rank()       OVER (ORDER BY salary DESC) AS rank,
       dense_rank() OVER (ORDER BY salary DESC) AS dense_rank
FROM employees
ORDER BY salary DESC
LIMIT 6;
```

They only differ on **ties**. Two department heads share the second-highest salary:

| function | tied rows get | next row gets |
|---|---|---|
| `row_number()` | different numbers (an arbitrary order among the tied rows) | the next number |
| `rank()` | the same rank | a rank that skips (1, 2, 2, **4**) |
| `dense_rank()` | the same rank | the next rank with no gap (1, 2, 2, **3**) |

`row_number` is only deterministic if the `ORDER BY` is unique, so add a tiebreaker such as `employee_id`.

## Top-N per group

The classic pattern: rank within each partition in a CTE, then filter:

```sql
WITH ranked AS (
  SELECT department_id, employee_id, salary,
         row_number() OVER (PARTITION BY department_id ORDER BY salary DESC, employee_id) AS rn
  FROM employees
  WHERE termination_date IS NULL
)
SELECT department_id, employee_id, salary
FROM ranked
WHERE rn <= 2
ORDER BY department_id, rn;
```

Use `rank() <= N` instead if tied rows at the cut-off should all be included.

## Deduplication

`row_number()` is also the standard way to keep **one row per key**, such as the latest record per entity:

```sql
WITH latest AS (
  SELECT employee_id, salary, effective_from,
         row_number() OVER (PARTITION BY employee_id ORDER BY effective_from DESC) AS rn
  FROM salary_history
)
SELECT employee_id, salary, effective_from
FROM latest
WHERE rn = 1 AND employee_id <= 5;
```

(PostgreSQL's `DISTINCT ON` from Module 1 does the same job in one step. `row_number` works in every database.)

## Buckets and percentiles

- `ntile(n)` splits each partition into *n* roughly equal buckets (quartiles with `ntile(4)`).
- `percent_rank()` gives the relative rank as a number from 0 to 1. `cume_dist()` gives the fraction of rows at or below the current one.

```sql
SELECT employee_id, salary,
       ntile(4) OVER (ORDER BY salary)                    AS quartile,
       round(percent_rank() OVER (ORDER BY salary)::numeric, 2) AS pct_rank
FROM employees
WHERE department_id = 9
ORDER BY salary;
```

> **Dialect note.** `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`, `PERCENT_RANK` and `CUME_DIST` exist in all major databases. SQL Server and Oracle also allow `TOP ... WITH TIES` and `FETCH ... WITH TIES`, which handle ties at an overall cut-off but not per group. Snowflake, BigQuery and DuckDB have a `QUALIFY` clause that filters on window functions directly. In PostgreSQL you need a CTE or subquery.
