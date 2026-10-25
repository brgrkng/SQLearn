---
title: Headcount by office
kind: problem
difficulty: easy
dataset: hr
ordered: true
---
Return each office `location` and the number of **current** employees working there (via their department). Include locations with nobody. Largest first, ties broken by location.

```sql solution
SELECT d.location, count(e.employee_id) AS headcount
FROM departments d
LEFT JOIN employees e ON e.department_id = d.department_id AND e.termination_date IS NULL
GROUP BY d.location
ORDER BY headcount DESC, d.location;
```

```sql wrong
SELECT d.location, count(*) AS headcount
FROM departments d
LEFT JOIN employees e ON e.department_id = d.department_id AND e.termination_date IS NULL
GROUP BY d.location
ORDER BY headcount DESC, d.location;
```

```sql wrong
SELECT d.location, count(e.employee_id) AS headcount
FROM departments d
JOIN employees e ON e.department_id = d.department_id
WHERE e.termination_date IS NULL
GROUP BY d.location
ORDER BY headcount DESC, d.location;
```
