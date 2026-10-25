---
title: Outer joins and anti-joins
kind: lesson
dataset: hr
---
An inner join drops rows that have no partner. The *Research* department has no employees, so it vanishes here:

```sql
SELECT d.name, count(*) AS employees
FROM departments d
JOIN employees e ON e.department_id = d.department_id
GROUP BY d.name
ORDER BY d.name;
```

## LEFT JOIN keeps every row on the left

`LEFT JOIN` returns every row of the left table. Where no right-hand row matches, the right-hand columns are **NULL**:

```sql
SELECT d.name, count(e.employee_id) AS employees
FROM departments d
LEFT JOIN employees e ON e.department_id = d.department_id
GROUP BY d.name
ORDER BY d.name;
```

Notice `count(e.employee_id)`, not `count(*)`. Research's group contains one row (the department with NULLs on the right), so `count(*)` would say 1. Counting a right-hand column counts only real matches.

`RIGHT JOIN` is the mirror image (keep every row on the right). It's rarely used, because you can swap the tables. `FULL JOIN` keeps unmatched rows from **both** sides.

## Finding rows with no match: the anti-join

"Which employees aren't on any project?" Left-join, then keep the rows where the right side came back NULL:

```sql
SELECT e.employee_id, e.first_name, e.last_name
FROM employees e
LEFT JOIN assignments a ON a.employee_id = e.employee_id
WHERE a.employee_id IS NULL
ORDER BY e.employee_id
LIMIT 10;
```

Test a column that can't be NULL in a real match: the join key or the primary key.

## The ON vs WHERE trap

With an **inner** join, a condition means the same in `ON` or `WHERE`. With an **outer** join it doesn't:

- A condition in `ON` decides **which right-hand rows match**. Unmatched left rows are still kept.
- A condition in `WHERE` runs **after** the join and filters the result, including the rows the outer join just preserved.

"Every department, with the number of **lead** assignments its people hold":

```sql
-- Wrong: WHERE throws away departments with no leads, including Research
SELECT d.name, count(a.employee_id) AS leads
FROM departments d
LEFT JOIN employees e   ON e.department_id = d.department_id
LEFT JOIN assignments a ON a.employee_id = e.employee_id
WHERE a.role = 'lead'
GROUP BY d.name
ORDER BY d.name;
```

```sql
-- Right: the filter is part of the match
SELECT d.name, count(a.employee_id) AS leads
FROM departments d
LEFT JOIN employees e   ON e.department_id = d.department_id
LEFT JOIN assignments a ON a.employee_id = e.employee_id AND a.role = 'lead'
GROUP BY d.name
ORDER BY d.name;
```

Rule of thumb: in a `LEFT JOIN`, conditions on the **right-hand** table go in `ON`. Conditions on the **left-hand** table go in `WHERE`.

> **Dialect note.** `LEFT`, `RIGHT` and `FULL [OUTER] JOIN` are standard. MySQL has no `FULL JOIN`; emulate it with a `LEFT JOIN` `UNION` a `RIGHT JOIN`. Old Oracle code writes outer joins as `WHERE a.id = b.id(+)`.
