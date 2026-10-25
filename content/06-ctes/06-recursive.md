---
title: Recursive CTEs
kind: lesson
dataset: hr
---
A self-join reaches exactly one level up the org chart. To go *any* number of levels you need **recursion**:

```sql
WITH RECURSIVE chain AS (
  -- anchor: where to start
  SELECT employee_id, manager_id, job_title, 0 AS depth
  FROM employees
  WHERE employee_id = 270

  UNION ALL

  -- recursive step: join the previous level's rows to their managers
  SELECT e.employee_id, e.manager_id, e.job_title, c.depth + 1
  FROM employees e
  JOIN chain c ON e.employee_id = c.manager_id
)
SELECT * FROM chain ORDER BY depth;
```

How it runs:

1. The **anchor** query runs once. Its rows become the first "working set".
2. The **recursive** query runs against the *previous step's* rows (here, by referring to `chain`), producing the next working set.
3. Step 2 repeats until a step produces no rows. The result is everything produced along the way, combined with `UNION ALL`.

Each step here moves one manager up, until the CEO's NULL `manager_id` matches nothing.

## Walking down: everyone under a manager

Flip the join direction to go down the tree. Build a path string as you go and you get an indented org chart:

```sql
WITH RECURSIVE team AS (
  SELECT employee_id, last_name, 0 AS depth, last_name AS path
  FROM employees WHERE employee_id = 9

  UNION ALL

  SELECT e.employee_id, e.last_name, t.depth + 1, t.path || ' > ' || e.last_name
  FROM employees e
  JOIN team t ON e.manager_id = t.employee_id
)
SELECT repeat('    ', depth) || last_name AS org_chart, depth
FROM team
ORDER BY path;
```

## Aggregating over a subtree

Once the subtree is in a CTE, it's an ordinary table. Here's the headcount and payroll under each department head:

```sql
WITH RECURSIVE under AS (
  SELECT employee_id AS head, employee_id FROM employees WHERE manager_id = 1
  UNION ALL
  SELECT u.head, e.employee_id
  FROM employees e JOIN under u ON e.manager_id = u.employee_id
)
SELECT u.head, count(*) - 1 AS reports, sum(e.salary) AS payroll
FROM under u JOIN employees e ON e.employee_id = u.employee_id
GROUP BY u.head
ORDER BY u.head;
```

Carrying `head` through every step tags each row with the subtree it belongs to.

## Not only trees

A recursive CTE is a loop, so it can generate data too:

```sql
WITH RECURSIVE n AS (
  SELECT 1 AS i
  UNION ALL
  SELECT i + 1 FROM n WHERE i < 5
)
SELECT i, i * i AS square FROM n;
```

## Guarding against cycles

If the data contains a cycle (A manages B, B manages A), the recursion never ends. PostgreSQL 14+ can detect cycles for you:

```sql
WITH RECURSIVE chain AS (
  SELECT employee_id, manager_id FROM employees WHERE employee_id = 270
  UNION ALL
  SELECT e.employee_id, e.manager_id FROM employees e JOIN chain c ON e.employee_id = c.manager_id
) CYCLE employee_id SET is_cycle USING path
SELECT employee_id, is_cycle FROM chain;
```

For older versions, carry an array of visited ids and stop when the next id is already in it (`WHERE NOT e.employee_id = ANY(c.visited)`). A depth limit (`WHERE depth < 20`) is a cheap safety net too.

> **Dialect note.** PostgreSQL and MySQL require the `RECURSIVE` keyword. SQL Server and Oracle infer it, so they just use `WITH`. Oracle also has the older `CONNECT BY PRIOR` syntax for hierarchies, which you'll still see in legacy code. `CYCLE` and `SEARCH` clauses are standard SQL but not widely implemented.
