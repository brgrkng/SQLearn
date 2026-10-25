---
title: Duplicate names
kind: problem
difficulty: easy
ordered: true
hints:
  - Group by both name columns and keep the groups with more than one row.
---
Find every **first name + last name** combination shared by **more than one** customer. Return `first_name`, `last_name` and how many customers share it, most common first, then alphabetically by last name and first name.

```sql solution
SELECT first_name, last_name, count(*) AS customers
FROM customers
GROUP BY first_name, last_name
HAVING count(*) > 1
ORDER BY customers DESC, last_name, first_name;
```

```sql wrong
SELECT first_name, last_name, count(*) AS customers
FROM customers
GROUP BY first_name, last_name
ORDER BY customers DESC, last_name, first_name;
```
