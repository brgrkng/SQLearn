---
title: The widest span of control
kind: problem
difficulty: medium
dataset: hr
hints:
  - Count direct reports per manager, then keep every manager whose count equals the maximum.
---
Which manager has the **most direct reports** (current employees only)? Return the manager's `employee_id`, `job_title` and number of direct reports. If several managers tie, return all of them, sorted by `employee_id`.

```sql solution
WITH reports AS (
  SELECT manager_id, count(*) AS n FROM employees
  WHERE termination_date IS NULL AND manager_id IS NOT NULL
  GROUP BY manager_id
)
SELECT m.employee_id, m.job_title, r.n AS direct_reports
FROM reports r JOIN employees m ON m.employee_id = r.manager_id
WHERE r.n = (SELECT max(n) FROM reports)
ORDER BY m.employee_id;
```

```sql wrong
SELECT m.employee_id, m.job_title, count(*) AS direct_reports
FROM employees e JOIN employees m ON m.employee_id = e.manager_id
GROUP BY m.employee_id, m.job_title
ORDER BY direct_reports DESC
LIMIT 1;
```
