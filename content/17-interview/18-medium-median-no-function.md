---
title: Median without a median function
kind: problem
difficulty: medium
dataset: hr
ordered: true
hints:
  - "Number the salaries in each department with `row_number()` and count them with `count(*) OVER (...)`."
  - "The middle rows are those where `rn` is between `n / 2.0` and `n / 2.0 + 1`. Average them."
---
Some databases have no `percentile_cont`. Compute the **median salary of current employees per department** using only window functions and ordinary aggregates. When a department has an even number of people, the median is the average of the two middle salaries. Return `department_id` and the median, sorted by `department_id`.

```sql solution
WITH ranked AS (
  SELECT department_id, salary,
         row_number() OVER (PARTITION BY department_id ORDER BY salary) AS rn,
         count(*) OVER (PARTITION BY department_id) AS n
  FROM employees
  WHERE termination_date IS NULL
)
SELECT department_id, avg(salary) AS median_salary
FROM ranked
WHERE rn BETWEEN n / 2.0 AND n / 2.0 + 1
GROUP BY department_id
ORDER BY department_id;
```

```sql wrong
WITH ranked AS (
  SELECT department_id, salary,
         row_number() OVER (PARTITION BY department_id ORDER BY salary) AS rn,
         count(*) OVER (PARTITION BY department_id) AS n
  FROM employees
  WHERE termination_date IS NULL
)
SELECT department_id, avg(salary) AS median_salary
FROM ranked
WHERE rn = n / 2 + 1
GROUP BY department_id
ORDER BY department_id;
```

## Explanation
For odd `n` (say 7), `n / 2.0` is 3.5, so only `rn = 4` lies between 3.5 and 4.5. For even `n` (say 8), rows 4 and 5 lie between 4 and 5, and their average is the median. The wrong version takes one middle row, which is only correct for odd group sizes. `percentile_cont(0.5) WITHIN GROUP (ORDER BY salary)` gives the same answer when it's available.
