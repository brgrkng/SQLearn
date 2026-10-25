---
title: A lending library
kind: test
dataset: empty
---
Design the schema for a library. Use these tables and columns (all ids are integers, everything not marked optional is required):

- `books(isbn, title)`, identified by ISBN (text)
- `copies(copy_id, isbn)`: the library owns several physical copies of a book
- `members(member_id, name, email)`: email is unique
- `loans(loan_id, copy_id, member_id, loaned_on, returned_on)`: `returned_on` is optional (NULL while on loan) and can't be before `loaned_on`

Rules: copies and loans must refer to things that exist, and **a copy can't be on loan twice at the same time** (at most one loan with no `returned_on` per copy).

```sql solution
CREATE TABLE books (isbn text PRIMARY KEY, title text NOT NULL);
CREATE TABLE copies (copy_id int PRIMARY KEY, isbn text NOT NULL REFERENCES books);
CREATE TABLE members (member_id int PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE);
CREATE TABLE loans (
  loan_id     int PRIMARY KEY,
  copy_id     int NOT NULL REFERENCES copies,
  member_id   int NOT NULL REFERENCES members,
  loaned_on   date NOT NULL,
  returned_on date,
  CHECK (returned_on >= loaned_on)
);
CREATE UNIQUE INDEX one_open_loan_per_copy ON loans (copy_id) WHERE returned_on IS NULL;
```

```sql check A normal lending history works
INSERT INTO books VALUES ('978-0', 'Dune');
INSERT INTO copies VALUES (1, '978-0'), (2, '978-0');
INSERT INTO members VALUES (1, 'Ada', 'ada@x.io'), (2, 'Alan', 'alan@x.io');
INSERT INTO loans VALUES (1, 1, 1, '2026-01-01', '2026-01-10'), (2, 1, 2, '2026-01-11', NULL), (3, 2, 1, '2026-01-12', NULL);
SELECT count(*) FROM loans WHERE returned_on IS NULL;
```

```sql check A copy can't be lent twice at once
INSERT INTO books VALUES ('978-1', 'Emma');
INSERT INTO copies VALUES (3, '978-1');
INSERT INTO members VALUES (3, 'Grace', 'grace@x.io');
INSERT INTO loans VALUES (4, 3, 3, '2026-02-01', NULL), (5, 3, 3, '2026-02-02', NULL);
```

```sql check Returns can't precede loans
INSERT INTO books VALUES ('978-2', 'Ulysses');
INSERT INTO copies VALUES (4, '978-2');
INSERT INTO members VALUES (4, 'Linus', 'linus@x.io');
INSERT INTO loans VALUES (6, 4, 4, '2026-02-10', '2026-02-01');
```

```sql check Copies need a real book
INSERT INTO copies VALUES (99, 'nope');
```

```sql check Emails are unique
INSERT INTO members VALUES (10, 'A', 'dup@x.io'), (11, 'B', 'dup@x.io');
```

```sql wrong
CREATE TABLE books (isbn text PRIMARY KEY, title text NOT NULL);
CREATE TABLE copies (copy_id int PRIMARY KEY, isbn text NOT NULL REFERENCES books);
CREATE TABLE members (member_id int PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE);
CREATE TABLE loans (
  loan_id     int PRIMARY KEY,
  copy_id     int NOT NULL REFERENCES copies,
  member_id   int NOT NULL REFERENCES members,
  loaned_on   date NOT NULL,
  returned_on date,
  CHECK (returned_on >= loaned_on)
);
```

```sql wrong
CREATE TABLE books (isbn text PRIMARY KEY, title text NOT NULL);
CREATE TABLE copies (copy_id int PRIMARY KEY, isbn text NOT NULL REFERENCES books);
CREATE TABLE members (member_id int PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE);
CREATE TABLE loans (
  loan_id     int PRIMARY KEY,
  copy_id     int NOT NULL UNIQUE REFERENCES copies,
  member_id   int NOT NULL REFERENCES members,
  loaned_on   date NOT NULL,
  returned_on date
);
```
