---
title: Pay by job title
kind: test
dataset: hr
ordered: true
---
For every job title held by **at least 10 employees** (current or former), return `job_title`, the number of employees, the median salary and the maximum salary. Highest median first.

```sql solution
SELECT job_title, count(*) AS employees,
       percentile_cont(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary,
       max(salary) AS max_salary
FROM employees
GROUP BY job_title
HAVING count(*) >= 10
ORDER BY median_salary DESC;
```

```sql wrong
SELECT job_title, count(*) AS employees, round(avg(salary), 2) AS median_salary, max(salary) AS max_salary
FROM employees
GROUP BY job_title
HAVING count(*) >= 10
ORDER BY median_salary DESC;
```
