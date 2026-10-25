---
title: Who manages nobody?
kind: drill
dataset: hr
ordered: true
hints:
  - Run the starter. Why is the result empty?
  - The CEO's `manager_id` is NULL, and that NULL is inside the subquery's result.
---
Return the `employee_id` and `job_title` of employees who **don't manage anyone** (no employee has them as `manager_id`). Only include employees with `employee_id` **below 40**. Sort by `employee_id`.

```sql starter
SELECT employee_id, job_title
FROM employees
WHERE employee_id < 40
  AND employee_id NOT IN (SELECT manager_id FROM employees)
ORDER BY employee_id;
```

```sql solution
SELECT e.employee_id, e.job_title
FROM employees e
WHERE e.employee_id < 40
  AND NOT EXISTS (SELECT 1 FROM employees r WHERE r.manager_id = e.employee_id)
ORDER BY e.employee_id;
```

## Explanation
`SELECT manager_id FROM employees` includes the CEO's NULL. `employee_id NOT IN (..., NULL)` can never be true, so the starter returns nothing. `NOT EXISTS` doesn't care about NULLs. Adding `WHERE manager_id IS NOT NULL` inside the subquery would also fix the `NOT IN` version.
