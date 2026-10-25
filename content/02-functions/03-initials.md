---
title: Initials
kind: drill
dataset: hr
hints:
  - "`left(text, 1)` returns the first character."
---
For every employee, return `employee_id` and their initials, such as `MO` for Margaret Okonkwo.

```sql starter
SELECT employee_id, first_name, last_name
FROM employees;
```

```sql solution
SELECT employee_id, left(first_name, 1) || left(last_name, 1) AS initials FROM employees;
```

```sql wrong
SELECT employee_id, left(first_name, 1) || '.' || left(last_name, 1) || '.' FROM employees;
```
