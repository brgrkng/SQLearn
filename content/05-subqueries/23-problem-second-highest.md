---
title: Third-highest salary
kind: problem
difficulty: easy
dataset: hr
hints:
  - Several people can share a salary, so you need *distinct* salaries.
  - "`SELECT DISTINCT salary ... ORDER BY salary DESC LIMIT 1 OFFSET 2`, or nest `max(...)` with `<`."
---
A classic interview question. Return the **third-highest distinct salary** in the company as a single value. If two people tie for second place, the third-highest is the next salary *below* theirs.

```sql solution
SELECT salary
FROM (SELECT DISTINCT salary FROM employees) AS s
ORDER BY salary DESC
LIMIT 1 OFFSET 2;
```

```sql wrong
SELECT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 2;
```

```sql wrong
SELECT max(salary) FROM employees WHERE salary < (SELECT max(salary) FROM employees);
```

## Explanation
Two department heads share the second-highest salary, so the third *row* of the sorted salaries is still the second-highest *value*. De-duplicate first (`DISTINCT`), then offset. The nested-`max` approach also works, one level per rank: `max(salary) WHERE salary < (SELECT max(salary) WHERE salary < (SELECT max(salary) ...))`.
