---
title: Changing tables with ALTER
kind: lesson
cumulative: true
dataset: empty
---
Schemas evolve. `ALTER TABLE` changes an existing table without losing its data:

```sql
CREATE TABLE members (member_id int PRIMARY KEY, full_name text, joined text);
INSERT INTO members VALUES (1, 'Ada Lovelace', '2024-03-01'), (2, 'Alan Turing', '2024-07-15');

ALTER TABLE members ADD COLUMN active boolean NOT NULL DEFAULT true;     -- new column
ALTER TABLE members RENAME COLUMN full_name TO name;                    -- rename
ALTER TABLE members ALTER COLUMN joined TYPE date USING joined::date;   -- change type
ALTER TABLE members ALTER COLUMN name SET NOT NULL;                     -- tighten a rule

SELECT * FROM members;
```

- **ADD COLUMN** with a constant default is instant in PostgreSQL 11+, even on huge tables. Existing rows get the default.
- **ALTER COLUMN ... TYPE** rewrites the table. `USING expr` tells PostgreSQL how to convert each existing value, and is required when there's no automatic cast (text → date, for example).
- **SET NOT NULL** checks every row first, and fails if any are NULL. Backfill the data, then add the rule.
- **DROP COLUMN**, **RENAME TO** (the table) and **SET DEFAULT** / **DROP DEFAULT** do what they say.

## Enum types

An **enum** is a type with a fixed list of allowed values:

```sql
CREATE TYPE priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TABLE tasks (task_id int PRIMARY KEY, title text NOT NULL, priority priority NOT NULL DEFAULT 'normal');
INSERT INTO tasks VALUES (1, 'Write report', 'high'), (2, 'Water plants', DEFAULT);
SELECT * FROM tasks ORDER BY priority DESC;
```

Enums sort in declaration order, not alphabetically. You can add values (`ALTER TYPE priority ADD VALUE 'blocker' AFTER 'urgent'`), but removing or renaming them is awkward. For lists that change often, a lookup table with a foreign key, or a `CHECK (status IN (...))` constraint, is easier to evolve.

## Dropping things

`DROP TABLE name` deletes the table and its data. It fails if other objects depend on it (a foreign key from another table, a view), unless you add `CASCADE`, which drops those too. Read what `CASCADE` will remove before you run it.

## Changing tables in production

On a busy database, some `ALTER`s lock the table while they rewrite it, blocking reads and writes. Real migrations are planned in safe steps: add a nullable column, backfill it in batches, then add the constraint, often with `NOT VALID` followed by `VALIDATE CONSTRAINT`. Tools like Flyway, Liquibase and Rails/Django migrations exist to version these changes. Treat schema changes as code.

> **Dialect note.** The `ALTER TABLE` details vary. SQL Server uses `sp_rename` for renames and `ALTER COLUMN` without `TYPE`. MySQL uses `MODIFY COLUMN` and `CHANGE COLUMN`. Oracle uses `MODIFY`. Only PostgreSQL and SQLite let you run most DDL inside a transaction and roll it back, which is a big safety advantage for migrations.
