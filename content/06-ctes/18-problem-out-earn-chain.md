---
title: Here before the bosses
kind: problem
difficulty: hard
dataset: hr
ordered: true
hints:
  - Walk *up* from every employee at once, carrying the employee's id and hire date.
  - Keep employees whose hire date is earlier than the earliest hire date anywhere in their chain.
---
Find employees who were **hired before every one of their managers**, all the way up to (but not including) the CEO. Employees reporting directly to the CEO don't count. Return `employee_id` and `hire_date`, sorted by `employee_id`.

```sql solution
WITH RECURSIVE up AS (
  SELECT e.employee_id, e.hire_date, m.hire_date AS boss_hired, m.manager_id AS next_id
  FROM employees e JOIN employees m ON m.employee_id = e.manager_id
  WHERE m.manager_id IS NOT NULL
  UNION ALL
  SELECT u.employee_id, u.hire_date, m.hire_date, m.manager_id
  FROM up u JOIN employees m ON m.employee_id = u.next_id
  WHERE m.manager_id IS NOT NULL
)
SELECT employee_id, hire_date
FROM up
GROUP BY employee_id, hire_date
HAVING hire_date < min(boss_hired)
ORDER BY employee_id;
```

```sql wrong
SELECT e.employee_id, e.hire_date
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE e.hire_date < m.hire_date AND m.manager_id IS NOT NULL
ORDER BY e.employee_id;
```

## Explanation
Each recursive step moves one level up and carries the original employee's id and hire date along, so the CTE holds one row per (employee, manager above them) pair, excluding the CEO. Grouping by employee and comparing with the **earliest** boss hire date answers "before every one" in a single test. The wrong version only checks the direct manager, so it includes people who joined before their manager but after their manager's manager.
