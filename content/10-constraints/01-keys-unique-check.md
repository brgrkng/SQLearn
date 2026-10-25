---
title: Keys, UNIQUE and CHECK
kind: lesson
dataset: empty
cumulative: true
---
```sql
CREATE TABLE courses (
  course_id   int PRIMARY KEY,
  code        text NOT NULL UNIQUE,
  title       text NOT NULL,
  credits     int  NOT NULL CHECK (credits BETWEEN 1 AND 30),
  starts_on   date NOT NULL,
  ends_on     date NOT NULL,
  CONSTRAINT valid_dates CHECK (ends_on > starts_on)
);
INSERT INTO courses VALUES (1, 'SQL101', 'Intro to SQL', 10, '2026-01-12', '2026-03-20');
SELECT * FROM courses;
```

## PRIMARY KEY

A primary key is `UNIQUE` + `NOT NULL`, and there's only one per table. It identifies each row and is what foreign keys point at. It can span **several columns** (a composite key), which is the natural key for a junction table:

```sql
CREATE TABLE enrollments (
  student_id int,
  course_id  int,
  enrolled_on date NOT NULL,
  PRIMARY KEY (student_id, course_id)
);
INSERT INTO enrollments VALUES (1, 1, '2026-01-05'), (2, 1, '2026-01-06');
SELECT * FROM enrollments;
```

## UNIQUE

`UNIQUE` forbids duplicate values in a column, or a *combination* of columns: `UNIQUE (team_id, username)` lets two teams each have an `alex`. It's enforced through an index, which also makes lookups on those columns fast.

**NULLs are not equal to each other**, so a `UNIQUE` column accepts any number of NULLs. That's usually right ("optional, but unique if present"). PostgreSQL 15+ can treat NULLs as equal with `UNIQUE NULLS NOT DISTINCT`.

## CHECK

A `CHECK` constraint is a boolean expression that every row must satisfy. It can compare columns of the same row, like `valid_dates` above. A CHECK *passes* when the expression is true **or NULL**, so pair it with `NOT NULL` if the column is required.

```sql error
INSERT INTO courses VALUES (2, 'SQL201', 'Advanced SQL', 40, '2026-04-01', '2026-06-01');
```

```sql error
INSERT INTO courses VALUES (3, 'SQL301', 'Expert SQL', 10, '2026-06-01', '2026-04-01');
```

CHECK constraints only see the current row. Rules that involve other rows ("no more than 30 students per course") need triggers (Module 14) or application logic.

## Names and errors

Name your constraints (`CONSTRAINT valid_dates CHECK (...)`). The name appears in error messages, which makes them understandable. It also lets you drop or change the constraint later. Unnamed constraints get generated names like `courses_credits_check`.

## Adding constraints to existing tables

```sql
ALTER TABLE enrollments ADD CONSTRAINT not_before_2020 CHECK (enrolled_on >= '2020-01-01');
SELECT conname FROM pg_constraint WHERE conrelid = 'enrollments'::regclass ORDER BY conname;
```

Adding a constraint checks **every existing row**, and fails if any row violates it. On a big table, `ADD CONSTRAINT ... NOT VALID` enforces the rule for new writes immediately, and `VALIDATE CONSTRAINT` checks the old rows later without blocking writes.

> **Dialect note.** All major databases support these constraints. MySQL only *enforces* CHECK constraints from 8.0.16 (earlier versions parsed and ignored them!). SQL Server's UNIQUE allows only **one** NULL, unlike the standard behaviour in PostgreSQL. Oracle treats `''` as NULL, which affects UNIQUE and NOT NULL on text.
