---
title: Thousands separators
kind: drill
dataset: hr
hints:
  - "`to_char(salary, 'FM999,999')`"
---
Payroll wants salaries shown with a thousands separator and no decimals, such as `148,000`. For employees in department **5** (*Finance*), return `employee_id` and the formatted salary.

```sql starter
SELECT employee_id, salary
FROM employees
WHERE department_id = 5;
```

```sql solution
SELECT employee_id, to_char(salary, 'FM999,999') AS salary_text
FROM employees
WHERE department_id = 5;
```

```sql wrong
SELECT employee_id, to_char(salary, '999,999') AS salary_text
FROM employees
WHERE department_id = 5;
```

## Explanation
Without `FM` ("fill mode"), `to_char` pads the result with a leading space reserved for a minus sign, giving `' 148,000'` rather than `'148,000'`. That space is invisible in most tools and breaks comparisons.
