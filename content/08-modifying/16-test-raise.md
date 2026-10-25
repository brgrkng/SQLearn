---
title: Support pay review
kind: test
dataset: hr
---
Give every **current** employee in department **7** (*Support*) a **4% raise**, rounded to the nearest **100**. Record each raise in `salary_history` with `effective_from` = **2026-01-01**.

```sql solution
UPDATE employees SET salary = round(salary * 1.04 / 100) * 100
WHERE department_id = 7 AND termination_date IS NULL;

INSERT INTO salary_history (employee_id, salary, effective_from)
SELECT employee_id, salary, '2026-01-01' FROM employees
WHERE department_id = 7 AND termination_date IS NULL;
```

```sql check New salaries
SELECT employee_id, salary FROM employees WHERE department_id = 7;
```

```sql check History rows for 2026-01-01
SELECT employee_id, salary FROM salary_history WHERE effective_from = '2026-01-01';
```

```sql wrong
UPDATE employees SET salary = round(salary * 1.04 / 100) * 100
WHERE department_id = 7 AND termination_date IS NULL;
```

```sql wrong
UPDATE employees SET salary = round(salary * 1.04, -2)
WHERE department_id = 7;

INSERT INTO salary_history (employee_id, salary, effective_from)
SELECT employee_id, salary, '2026-01-01' FROM employees WHERE department_id = 7;
```
