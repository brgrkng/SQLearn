---
title: How to approach a SQL interview question
kind: lesson
dataset: hr
---
SQL interviews test whether you can turn a vague business question into a correct query, and explain your reasoning as you go. A dependable process:

## 1. Pin down the output

What is **one row** of the answer: one per customer, per day, per (user, month)? Which columns, in which order? What happens to ties? Should zero-count groups appear? Ask, or state your assumption out loud. Most wrong answers are right answers to a slightly different question.

## 2. Find the grain of each table

Does the table have one row per order, or one per order line? Joining tables with different grains is where fan-out bugs come from (Module 4). Aggregate to the grain you need **before** joining.

## 3. Build in steps

Write a CTE for each step and look at its output before writing the next:

```sql
WITH current_staff AS (
  SELECT * FROM employees WHERE termination_date IS NULL
),
dept_stats AS (
  SELECT department_id, count(*) AS headcount, avg(salary) AS avg_salary
  FROM current_staff
  GROUP BY department_id
)
SELECT d.name, s.headcount, round(s.avg_salary) AS avg_salary
FROM dept_stats s JOIN departments d USING (department_id)
ORDER BY s.headcount DESC;
```

Each step is small, testable and easy to explain. Interviewers value clarity over clever one-liners.

## 4. Reach for the standard patterns

| Question shape | Pattern |
|---|---|
| "top N per group", "latest per entity" | `row_number()` / `rank()` in a CTE, or `DISTINCT ON`, or `LATERAL` |
| "has never", "without any" | `NOT EXISTS` (not `NOT IN`) |
| "for every", "all of" | count matching items and compare with the total, or a double `NOT EXISTS` |
| "consecutive", "streak" | gaps and islands: `date - row_number()` |
| "compared with previous" | `lag()` |
| "running", "cumulative" | `sum() OVER (ORDER BY ...)` |
| "share of total" | `x / sum(x) OVER ()` |
| "per day, including days with none" | `generate_series` calendar + `LEFT JOIN` |
| "hierarchy of any depth" | recursive CTE |
| "sessions", "bursts" | `lag` + flag + running sum |

## 5. Check the edge cases

- **NULLs.** Do they vanish from `<>`, `NOT IN` or `count(col)`?
- **Ties.** `row_number` picks arbitrarily. Did the question want all tied rows?
- **Duplicates.** Did a join multiply rows?
- **Empty groups.** Should a department with nobody show 0?
- **Integer division.** Use `100.0 *`.
- **Date ranges.** Use half-open ranges, and remember `timestamp` vs `date`.

## 6. Talk about performance

Mention which indexes would help, why you avoided a correlated subquery, and how the query behaves at 100× the data. Here, the efficiency grade keeps you honest.
