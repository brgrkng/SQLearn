---
title: Optional mentors
kind: drill
dataset: empty
hints:
  - A nullable self-referencing foreign key.
---
Design `engineers(engineer_id, name, mentor_id)`. An engineer **may** have a mentor, who must be another engineer. Engineers without a mentor are allowed. An engineer can't be their own mentor.

```sql solution
CREATE TABLE engineers (
  engineer_id int PRIMARY KEY,
  name        text NOT NULL,
  mentor_id   int REFERENCES engineers,
  CHECK (mentor_id <> engineer_id)
);
```

```sql check Mentors are optional
INSERT INTO engineers VALUES (1, 'Ada', NULL), (2, 'Alan', 1), (3, 'Grace', 1);
SELECT count(*) FROM engineers WHERE mentor_id = 1;
```

```sql check Mentors must exist
INSERT INTO engineers VALUES (4, 'Linus', 99);
```

```sql check Nobody mentors themselves
INSERT INTO engineers VALUES (5, 'Edsger', 5);
```

```sql wrong
CREATE TABLE engineers (engineer_id int PRIMARY KEY, name text NOT NULL, mentor_id int REFERENCES engineers);
```
