---
title: Leavers by month
kind: drill
dataset: hr
ordered: true
hints:
  - Build the 12 months with `generate_series`, then LEFT JOIN employees whose termination falls in that month.
  - "Count `e.employee_id`, not `*`."
---
HR wants the number of employees who **left** (by `termination_date`) in each month of **2024**, including months when nobody left. Return the month (first day, as a `date`) and the count, in order.

```sql solution
SELECT m::date AS month, count(e.employee_id) AS leavers
FROM generate_series(date '2024-01-01', date '2024-12-01', interval '1 month') AS m
LEFT JOIN employees e ON date_trunc('month', e.termination_date) = m
GROUP BY m
ORDER BY m;
```

```sql wrong
SELECT date_trunc('month', termination_date)::date AS month, count(*) AS leavers
FROM employees
WHERE termination_date >= '2024-01-01' AND termination_date < '2025-01-01'
GROUP BY month
ORDER BY month;
```

```sql wrong
SELECT m::date AS month, count(*) AS leavers
FROM generate_series(date '2024-01-01', date '2024-12-01', interval '1 month') AS m
LEFT JOIN employees e ON date_trunc('month', e.termination_date) = m
GROUP BY m
ORDER BY m;
```
