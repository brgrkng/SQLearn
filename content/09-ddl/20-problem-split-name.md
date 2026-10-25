---
title: Split a name column
kind: problem
difficulty: medium
dataset: empty
hints:
  - Add the two new columns, fill them with an UPDATE using `split_part`, then make them required and drop the old column.
---
`people.full_name` holds names like `Ada Lovelace` (always exactly one space). Replace it with two **required** `text` columns, `first_name` and `last_name`, keeping the data. The `full_name` column must be gone afterwards.

```sql setup
CREATE TABLE people (person_id int PRIMARY KEY, full_name text NOT NULL);
INSERT INTO people VALUES (1, 'Ada Lovelace'), (2, 'Alan Turing'), (3, 'Grace Hopper');
```

```sql solution
ALTER TABLE people ADD COLUMN first_name text, ADD COLUMN last_name text;
UPDATE people SET first_name = split_part(full_name, ' ', 1), last_name = split_part(full_name, ' ', 2);
ALTER TABLE people ALTER COLUMN first_name SET NOT NULL, ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE people DROP COLUMN full_name;
```

```sql check Names are split
SELECT person_id, first_name, last_name FROM people;
```

```sql check Columns
SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'people';
```

```sql wrong
ALTER TABLE people ADD COLUMN first_name text, ADD COLUMN last_name text;
UPDATE people SET first_name = split_part(full_name, ' ', 1), last_name = split_part(full_name, ' ', 2);
ALTER TABLE people DROP COLUMN full_name;
```
