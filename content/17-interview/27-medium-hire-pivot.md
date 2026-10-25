---
title: Hiring by department and year
kind: problem
difficulty: medium
dataset: hr
ordered: true
---
Build a pivot of hires: one row per department `name`, with columns for the number of people hired in **2022**, **2023**, **2024** and **2025** (current and former employees). Include every department, even those with no hires. Sort by department name.

```sql solution
SELECT d.name,
       count(e.employee_id) FILTER (WHERE extract(year FROM e.hire_date) = 2022) AS hired_2022,
       count(e.employee_id) FILTER (WHERE extract(year FROM e.hire_date) = 2023) AS hired_2023,
       count(e.employee_id) FILTER (WHERE extract(year FROM e.hire_date) = 2024) AS hired_2024,
       count(e.employee_id) FILTER (WHERE extract(year FROM e.hire_date) = 2025) AS hired_2025
FROM departments d
LEFT JOIN employees e ON e.department_id = d.department_id
GROUP BY d.name
ORDER BY d.name;
```

```sql wrong
SELECT d.name,
       count(e.employee_id) FILTER (WHERE extract(year FROM e.hire_date) = 2022) AS hired_2022,
       count(e.employee_id) FILTER (WHERE extract(year FROM e.hire_date) = 2023) AS hired_2023,
       count(e.employee_id) FILTER (WHERE extract(year FROM e.hire_date) = 2024) AS hired_2024,
       count(e.employee_id) FILTER (WHERE extract(year FROM e.hire_date) = 2025) AS hired_2025
FROM departments d
JOIN employees e ON e.department_id = d.department_id
GROUP BY d.name
ORDER BY d.name;
```
