---
title: Transitive dependency (3NF)
kind: drill
dataset: empty
hints:
  - "`dept_name` and `floor` depend on `dept_code`, not on `staff_id` directly."
---
In `staff_raw`, `dept_name` and `floor` depend on `dept_code`, which in turn depends on the key `staff_id`. Normalize into:

- `departments(dept_code, dept_name, floor)`, keyed by `dept_code`
- `staff(staff_id, name, dept_code)`, keyed by `staff_id`, with `dept_code` required and referring to `departments`

Fill both from `staff_raw`.

```sql setup
CREATE TABLE staff_raw (staff_id int, name text, dept_code text, dept_name text, floor int);
INSERT INTO staff_raw VALUES
  (1, 'Ada', 'ENG', 'Engineering', 3), (2, 'Alan', 'ENG', 'Engineering', 3),
  (3, 'Grace', 'OPS', 'Operations', 1), (4, 'Edsger', 'ENG', 'Engineering', 3), (5, 'Barbara', 'RES', 'Research', 4);
```

```sql solution
CREATE TABLE departments (dept_code text PRIMARY KEY, dept_name text NOT NULL, floor int);
INSERT INTO departments SELECT DISTINCT dept_code, dept_name, floor FROM staff_raw;
CREATE TABLE staff (staff_id int PRIMARY KEY, name text NOT NULL, dept_code text NOT NULL REFERENCES departments);
INSERT INTO staff SELECT staff_id, name, dept_code FROM staff_raw;
```

```sql check Departments, once each
SELECT dept_code, dept_name, floor FROM departments;
```

```sql check Staff
SELECT staff_id, name, dept_code FROM staff;
```

```sql check Moving a department is one update
UPDATE departments SET floor = 5 WHERE dept_code = 'ENG';
SELECT s.name FROM staff s JOIN departments d USING (dept_code) WHERE d.floor = 5;
```

```sql check Staff rows hold no department facts
SELECT column_name FROM information_schema.columns WHERE table_name = 'staff';
```

```sql check Staff need a real department
INSERT INTO staff VALUES (6, 'Linus', 'XXX');
```

```sql wrong
CREATE TABLE departments (dept_code text PRIMARY KEY, dept_name text NOT NULL, floor int);
INSERT INTO departments SELECT DISTINCT dept_code, dept_name, floor FROM staff_raw;
CREATE TABLE staff (staff_id int PRIMARY KEY, name text NOT NULL, dept_code text NOT NULL REFERENCES departments, floor int);
INSERT INTO staff SELECT staff_id, name, dept_code, floor FROM staff_raw;
```
