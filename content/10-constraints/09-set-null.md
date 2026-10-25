---
title: When the manager leaves
kind: drill
dataset: empty
hints:
  - "A self-referencing foreign key: `manager_id int REFERENCES staff (staff_id) ON DELETE SET NULL`."
---
Create `staff` with `staff_id` (`int`, primary key), `name` (required `text`) and `manager_id` (optional, referring to another row of `staff`). When a manager is deleted, their reports must **stay**, with `manager_id` set to NULL.

```sql solution
CREATE TABLE staff (
  staff_id   int PRIMARY KEY,
  name       text NOT NULL,
  manager_id int REFERENCES staff (staff_id) ON DELETE SET NULL
);
```

```sql check Deleting a manager keeps their reports
INSERT INTO staff VALUES (1, 'Boss', NULL), (2, 'Ada', 1), (3, 'Alan', 1), (4, 'Grace', 2);
DELETE FROM staff WHERE staff_id = 1;
SELECT staff_id, manager_id FROM staff;
```

```sql check Managers must exist
INSERT INTO staff VALUES (9, 'Nobody', 99);
```

```sql wrong
CREATE TABLE staff (
  staff_id   int PRIMARY KEY,
  name       text NOT NULL,
  manager_id int REFERENCES staff (staff_id) ON DELETE CASCADE
);
```
