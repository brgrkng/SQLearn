---
title: Long names
kind: test
dataset: hr
ordered: true
---
The badge printer fits 15 characters. Return `employee_id`, the full name (first name, a space, last name) and its length for every employee whose full name is **longer than 15 characters**. Longest first, ties broken by `employee_id`.

```sql solution
SELECT employee_id, first_name || ' ' || last_name AS full_name, length(first_name || ' ' || last_name) AS len
FROM employees
WHERE length(first_name || ' ' || last_name) > 15
ORDER BY len DESC, employee_id;
```

```sql wrong
SELECT employee_id, first_name || ' ' || last_name AS full_name, length(first_name || last_name) AS len
FROM employees
WHERE length(first_name || last_name) > 15
ORDER BY len DESC, employee_id;
```

```sql wrong
SELECT employee_id, first_name || ' ' || last_name AS full_name, length(first_name || ' ' || last_name) AS len
FROM employees
WHERE length(first_name || ' ' || last_name) >= 15
ORDER BY len DESC, employee_id;
```
