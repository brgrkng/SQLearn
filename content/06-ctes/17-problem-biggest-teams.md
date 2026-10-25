---
title: Biggest teams
kind: problem
difficulty: medium
dataset: hr
ordered: true
hints:
  - Every employee who manages someone is the root of a subtree. Anchor on all of them at once.
  - Carry the root through the recursion, then count per root.
---
For every employee who manages at least one person, count the people **below them at any depth** (current or former). Return the `employee_id` and team size of the **5 largest teams**, largest first, ties broken by `employee_id`.

```sql solution
WITH RECURSIVE under AS (
  SELECT m.employee_id AS root, e.employee_id
  FROM employees m JOIN employees e ON e.manager_id = m.employee_id
  UNION ALL
  SELECT u.root, e.employee_id FROM employees e JOIN under u ON e.manager_id = u.employee_id
)
SELECT root AS employee_id, count(*) AS team_size
FROM under
GROUP BY root
ORDER BY team_size DESC, root
LIMIT 5;
```

```sql wrong
SELECT manager_id AS employee_id, count(*) AS team_size
FROM employees
WHERE manager_id IS NOT NULL
GROUP BY manager_id
ORDER BY team_size DESC, manager_id
LIMIT 5;
```
