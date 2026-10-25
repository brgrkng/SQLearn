---
title: Names with numbers
kind: drill
hints:
  - "`~` matches a regular expression. `[0-9]` is any digit."
---
Return the `name` of every product whose name contains **at least one digit**.

```sql starter
SELECT name
FROM products;
```

```sql solution
SELECT name FROM products WHERE name ~ '[0-9]';
```

```sql wrong
SELECT name FROM products WHERE name LIKE '%0%';
```
