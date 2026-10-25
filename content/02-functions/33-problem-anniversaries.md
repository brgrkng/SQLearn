---
title: March anniversaries
kind: problem
difficulty: medium
dataset: hr
ordered: true
hints:
  - Only current employees celebrate. Check `termination_date`.
  - The number of years completed in 2026 is `2026 - hire year`.
---
HR sends a card to every **current** employee whose work anniversary falls in **March 2026**. Return `employee_id`, `hire_date`, and the number of years they complete in March 2026, sorted by the day of the month they were hired, then `employee_id`.

```sql solution
SELECT employee_id, hire_date, 2026 - extract(year FROM hire_date) AS years
FROM employees
WHERE termination_date IS NULL AND extract(month FROM hire_date) = 3
ORDER BY extract(day FROM hire_date), employee_id;
```

```sql wrong
SELECT employee_id, hire_date, 2026 - extract(year FROM hire_date) AS years
FROM employees
WHERE extract(month FROM hire_date) = 3
ORDER BY extract(day FROM hire_date), employee_id;
```

```sql wrong
SELECT employee_id, hire_date, 2026 - extract(year FROM hire_date) AS years
FROM employees
WHERE termination_date IS NULL AND extract(month FROM hire_date) = 3
ORDER BY hire_date, employee_id;
```
