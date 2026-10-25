---
title: Fibonacci
kind: problem
difficulty: easy
ordered: true
hints:
  - Carry two numbers through each step, the current one and the next one.
---
Generate the **Fibonacci numbers below 1000** (0, 1, 1, 2, 3, 5, …) with a recursive CTE, one per row, in order.

```sql solution
WITH RECURSIVE fib AS (
  SELECT 0 AS a, 1 AS b
  UNION ALL
  SELECT b, a + b FROM fib WHERE b < 1000
)
SELECT a AS fibonacci FROM fib;
```

```sql wrong
WITH RECURSIVE fib AS (
  SELECT 1 AS a, 1 AS b
  UNION ALL
  SELECT b, a + b FROM fib WHERE b < 1000
)
SELECT a AS fibonacci FROM fib;
```
