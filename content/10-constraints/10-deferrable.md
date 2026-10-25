---
title: Chicken and egg
kind: drill
dataset: empty
hints:
  - "Each foreign key needs `DEFERRABLE INITIALLY DEFERRED` so the check waits until COMMIT."
  - Create both tables first, then add one of the foreign keys with `ALTER TABLE`.
---
Every **department** must have a head (`head_id`, required, referring to `employees`), and every **employee** must belong to a department (`department_id`, required, referring to `departments`). To add a new department and its first employee, both rows must go in **within one transaction**, so the foreign keys can't be checked until `COMMIT`.

Create `departments (department_id int PK, name text NOT NULL, head_id int NOT NULL)` and `employees (employee_id int PK, name text NOT NULL, department_id int NOT NULL)` with both foreign keys.

```sql solution
CREATE TABLE departments (department_id int PRIMARY KEY, name text NOT NULL, head_id int NOT NULL);
CREATE TABLE employees (
  employee_id   int PRIMARY KEY,
  name          text NOT NULL,
  department_id int NOT NULL REFERENCES departments DEFERRABLE INITIALLY DEFERRED
);
ALTER TABLE departments ADD FOREIGN KEY (head_id) REFERENCES employees DEFERRABLE INITIALLY DEFERRED;
```

```sql check A department and its head can be added together
BEGIN;
INSERT INTO departments VALUES (1, 'Research', 100);
INSERT INTO employees VALUES (100, 'Ada', 1);
COMMIT;
SELECT d.name, e.name FROM departments d JOIN employees e ON e.employee_id = d.head_id;
```

```sql check A department whose head never arrives is rejected at commit
BEGIN;
INSERT INTO departments VALUES (2, 'Ghost', 999);
COMMIT;
```

```sql wrong
CREATE TABLE departments (department_id int PRIMARY KEY, name text NOT NULL, head_id int NOT NULL);
CREATE TABLE employees (
  employee_id   int PRIMARY KEY,
  name          text NOT NULL,
  department_id int NOT NULL REFERENCES departments
);
ALTER TABLE departments ADD FOREIGN KEY (head_id) REFERENCES employees;
```
