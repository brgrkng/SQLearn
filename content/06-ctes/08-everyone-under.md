---
title: Everyone in Sales
kind: drill
dataset: hr
ordered: true
hints:
  - Start from employee 3 (VP of Sales) and repeatedly join employees whose `manager_id` is in the set so far.
---
Return every employee who reports **directly or indirectly** to **employee 3** (not including employee 3), with their `employee_id` and their **depth** below employee 3 (direct reports are depth 1). Sort by depth, then `employee_id`.

```sql solution
WITH RECURSIVE team AS (
  SELECT employee_id, 0 AS depth FROM employees WHERE employee_id = 3
  UNION ALL
  SELECT e.employee_id, t.depth + 1
  FROM employees e JOIN team t ON e.manager_id = t.employee_id
)
SELECT employee_id, depth FROM team WHERE depth > 0 ORDER BY depth, employee_id;
```

```sql wrong
SELECT employee_id, 1 AS depth FROM employees WHERE manager_id = 3 ORDER BY employee_id;
```
