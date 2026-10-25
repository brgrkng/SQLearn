---
title: Team sizes
kind: drill
dataset: hr
ordered: true
hints:
  - Carry the starting head's id through every step of the recursion.
---
For each **department head** (the employees reporting directly to the CEO, employee 1), return their `employee_id` and the number of people **below them at any depth**, current or former. Sort by `employee_id`.

```sql solution
WITH RECURSIVE under AS (
  SELECT employee_id AS head, employee_id FROM employees WHERE manager_id = 1
  UNION ALL
  SELECT u.head, e.employee_id FROM employees e JOIN under u ON e.manager_id = u.employee_id
)
SELECT head AS employee_id, count(*) - 1 AS team_size
FROM under
GROUP BY head
ORDER BY head;
```

```sql wrong
SELECT m.employee_id, count(e.employee_id) AS team_size
FROM employees m
LEFT JOIN employees e ON e.manager_id = m.employee_id
WHERE m.manager_id = 1
GROUP BY m.employee_id
ORDER BY m.employee_id;
```
