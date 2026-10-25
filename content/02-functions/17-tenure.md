---
title: Years of service
kind: drill
dataset: hr
hints:
  - "`age(later, earlier)` returns an interval like `3 years 2 mons 5 days`."
  - "`extract(year FROM age(...))` gives the whole years."
---
For employees in department **9** (*Legal*), return `employee_id`, `hire_date`, and their **completed years of service as of 1 January 2026**. Someone hired on 2 January 2020 has 5 completed years, not 6.

```sql starter
SELECT employee_id, hire_date
FROM employees
WHERE department_id = 9;
```

```sql solution
SELECT employee_id, hire_date, extract(year FROM age(date '2026-01-01', hire_date)) AS years
FROM employees
WHERE department_id = 9;
```

```sql wrong
SELECT employee_id, hire_date, extract(year FROM date '2026-01-01') - extract(year FROM hire_date) AS years
FROM employees
WHERE department_id = 9;
```

## Explanation
Subtracting calendar years counts everyone hired at any point in 2020 as having 6 years. `age` does the calendar arithmetic properly: it only counts a year once the anniversary has passed.
