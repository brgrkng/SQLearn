---
title: A small migration
kind: test
dataset: empty
---
Migrate `staff`:

1. Add a required `boolean` column `remote`, false for everyone.
2. Rename `dept` to `department`.
3. Change `started` from `text` to `date`.

```sql setup
CREATE TABLE staff (staff_id int PRIMARY KEY, name text NOT NULL, dept text, started text);
INSERT INTO staff VALUES (1, 'Ada', 'Eng', '2023-04-01'), (2, 'Alan', 'Eng', '2022-11-15'), (3, 'Grace', 'Ops', '2024-01-08');
```

```sql solution
ALTER TABLE staff ADD COLUMN remote boolean NOT NULL DEFAULT false;
ALTER TABLE staff RENAME COLUMN dept TO department;
ALTER TABLE staff ALTER COLUMN started TYPE date USING started::date;
```

```sql check Data after migration
SELECT staff_id, department, started, remote FROM staff;
```

```sql check Column types
SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'staff';
```

```sql wrong
ALTER TABLE staff ADD COLUMN remote boolean DEFAULT false;
ALTER TABLE staff RENAME COLUMN dept TO department;
ALTER TABLE staff ALTER COLUMN started TYPE date USING started::date;
```
