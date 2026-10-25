---
title: Students and courses
kind: drill
dataset: empty
hints:
  - "A junction table `enrollments` with two foreign keys and a composite primary key."
---
Design `students(student_id, name)`, `courses(course_id, title)` and `enrollments(student_id, course_id, enrolled_on)`. A student can take many courses and a course has many students, but a student can't enrol in the **same course twice**. Every enrollment needs a date and must refer to a real student and course.

```sql solution
CREATE TABLE students (student_id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE courses (course_id int PRIMARY KEY, title text NOT NULL);
CREATE TABLE enrollments (
  student_id  int REFERENCES students,
  course_id   int REFERENCES courses,
  enrolled_on date NOT NULL,
  PRIMARY KEY (student_id, course_id)
);
```

```sql check Many-to-many works
INSERT INTO students VALUES (1, 'Ada'), (2, 'Alan');
INSERT INTO courses VALUES (10, 'Databases'), (11, 'Compilers');
INSERT INTO enrollments VALUES (1, 10, '2026-01-05'), (1, 11, '2026-01-05'), (2, 10, '2026-01-06');
SELECT count(*) FROM enrollments;
```

```sql check No double enrolment
INSERT INTO students VALUES (3, 'Grace');
INSERT INTO courses VALUES (12, 'Networks');
INSERT INTO enrollments VALUES (3, 12, '2026-01-07'), (3, 12, '2026-02-01');
```

```sql check Enrolments must reference real rows
INSERT INTO enrollments VALUES (99, 10, '2026-01-07');
```

```sql check A date is required
INSERT INTO students VALUES (4, 'Edsger');
INSERT INTO enrollments VALUES (4, 10, NULL);
```

```sql wrong
CREATE TABLE students (student_id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE courses (course_id int PRIMARY KEY, title text NOT NULL);
CREATE TABLE enrollments (student_id int REFERENCES students, course_id int REFERENCES courses, enrolled_on date NOT NULL);
```
