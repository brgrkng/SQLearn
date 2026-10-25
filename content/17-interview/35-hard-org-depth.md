---
title: Depth and span
kind: problem
difficulty: hard
dataset: hr
ordered: true
hints:
  - "One recursive CTE from the CEO gives every employee's level."
  - "A second recursive CTE (or a closure-style walk) gives everyone below each manager."
---
For every employee who manages at least one person, return their `employee_id`, their **level** in the org chart (the CEO is level 0), their number of **direct** reports and their **total** number of reports at any depth (current and former employees alike). Sort by level, then total reports descending, then `employee_id`.

```sql solution
WITH RECURSIVE levels AS (
  SELECT employee_id, 0 AS level FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, l.level + 1 FROM employees e JOIN levels l ON e.manager_id = l.employee_id
),
below AS (
  SELECT manager_id AS root, employee_id FROM employees WHERE manager_id IS NOT NULL
  UNION ALL
  SELECT b.root, e.employee_id FROM employees e JOIN below b ON e.manager_id = b.employee_id
),
totals AS (
  SELECT root, count(*) AS total_reports FROM below GROUP BY root
),
directs AS (
  SELECT manager_id, count(*) AS direct_reports FROM employees WHERE manager_id IS NOT NULL GROUP BY manager_id
)
SELECT t.root AS employee_id, l.level, d.direct_reports, t.total_reports
FROM totals t
JOIN levels l ON l.employee_id = t.root
JOIN directs d ON d.manager_id = t.root
ORDER BY l.level, t.total_reports DESC, t.root;
```

```sql wrong
WITH RECURSIVE levels AS (
  SELECT employee_id, 0 AS level FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, l.level + 1 FROM employees e JOIN levels l ON e.manager_id = l.employee_id
),
directs AS (
  SELECT manager_id, count(*) AS direct_reports FROM employees WHERE manager_id IS NOT NULL GROUP BY manager_id
)
SELECT d.manager_id AS employee_id, l.level, d.direct_reports, d.direct_reports AS total_reports
FROM directs d JOIN levels l ON l.employee_id = d.manager_id
ORDER BY l.level, total_reports DESC, d.manager_id;
```
