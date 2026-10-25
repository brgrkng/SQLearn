---
title: Entities, relationships and keys
kind: lesson
dataset: empty
cumulative: true
---
## Cardinality

Every relationship between two entities has a **cardinality**: how many of one can relate to how many of the other.

| Relationship | Example | How to build it |
|---|---|---|
| **One-to-many** (1:N) | a customer places many orders | a foreign key on the "many" side: `orders.customer_id` |
| **Many-to-many** (M:N) | students take many courses, courses have many students | a **junction table** with two foreign keys: `enrollments(student_id, course_id)` |
| **One-to-one** (1:1) | a user has at most one profile | a foreign key that is also `UNIQUE` (often it's the primary key too) |

Also decide **optionality**: must every order have a customer (`NOT NULL`), or can an employee have no manager (nullable)?

An ER diagram in text form, the kind you'd sketch before writing DDL:

```sql norun
customers 1 ──< orders 1 ──< order_lines >── 1 products
students  1 ──< enrollments >── 1 courses          (M:N via junction)
users     1 ── 0..1 profiles                        (1:1, optional)
```

## Many-to-many: the junction table

A junction table often carries attributes of the *relationship* itself: when the student enrolled, their grade.

```sql
CREATE TABLE students (student_id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE courses  (course_id int PRIMARY KEY, title text NOT NULL);
CREATE TABLE enrollments (
  student_id  int REFERENCES students,
  course_id   int REFERENCES courses,
  enrolled_on date NOT NULL,
  grade       text,
  PRIMARY KEY (student_id, course_id)
);
INSERT INTO students VALUES (1, 'Ada'), (2, 'Alan');
INSERT INTO courses VALUES (10, 'Databases'), (11, 'Compilers');
INSERT INTO enrollments VALUES (1, 10, '2026-01-05', NULL), (1, 11, '2026-01-05', NULL), (2, 10, '2026-01-06', 'A');
SELECT s.name, c.title, e.grade
FROM enrollments e JOIN students s USING (student_id) JOIN courses c USING (course_id)
ORDER BY s.name, c.title;
```

## One-to-one

Use a 1:1 table to split off optional or rarely used data, or data with different access rules:

```sql
CREATE TABLE users (user_id int PRIMARY KEY, email text NOT NULL UNIQUE);
CREATE TABLE user_profiles (
  user_id int PRIMARY KEY REFERENCES users ON DELETE CASCADE,   -- PK and FK: at most one profile per user
  bio     text,
  website text
);
SELECT 'ok' AS created;
```

## Natural or surrogate keys?

- A **natural key** is a real-world identifier: an ISBN, a country code, an email address.
- A **surrogate key** is a meaningless generated number or UUID.

Natural keys look tempting but often turn out not to be unique, not to be stable (people change emails), or not to be known when the row is created. A common, robust convention: give every entity a **surrogate primary key**, and protect natural identifiers with **UNIQUE** constraints. Junction tables are the exception, because their natural key, the pair of foreign keys, is perfect.

> **Dialect note.** These modelling ideas are universal. ER notation varies: crow's foot (shown above in ASCII), Chen notation, UML class diagrams. Tools like dbdiagram.io, pgModeler and DBeaver draw them from DDL.
