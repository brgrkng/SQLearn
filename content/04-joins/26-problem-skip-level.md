---
title: Two levels below the CEO
kind: problem
difficulty: medium
dataset: hr
ordered: true
hints:
  - Join employees to their manager, and the manager to *their* manager.
  - The CEO is the employee with no manager.
---
Find the employees whose **manager's manager is the CEO** (the employee with no manager). Return `employee_id`, `job_title`, and the `employee_id` of their direct manager. Sort by `employee_id`.

```sql solution
SELECT e.employee_id, e.job_title, m.employee_id AS manager_id
FROM employees e
JOIN employees m   ON m.employee_id = e.manager_id
JOIN employees ceo ON ceo.employee_id = m.manager_id
WHERE ceo.manager_id IS NULL
ORDER BY e.employee_id;
```

```sql wrong
SELECT e.employee_id, e.job_title, m.employee_id AS manager_id
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE m.manager_id IS NULL
ORDER BY e.employee_id;
```
