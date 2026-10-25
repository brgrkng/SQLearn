---
title: Stamp every change
kind: drill
dataset: empty
hints:
  - "A `BEFORE UPDATE ... FOR EACH ROW` trigger whose function sets `NEW.updated_at := now();` and returns `NEW`."
---
The setup creates `tasks` with an `updated_at` column. Add a trigger so that **every UPDATE** automatically sets `updated_at` to the current time, whatever the UPDATE itself says.

```sql setup
CREATE TABLE tasks (task_id int PRIMARY KEY, title text NOT NULL, done boolean NOT NULL DEFAULT false,
                    updated_at timestamptz NOT NULL DEFAULT '2000-01-01');
INSERT INTO tasks (task_id, title) VALUES (1, 'Write tests'), (2, 'Ship it');
```

```sql solution
CREATE FUNCTION touch() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END
$$;
CREATE TRIGGER tasks_touch BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION touch();
```

```sql check Updated rows get a fresh timestamp
UPDATE tasks SET done = true WHERE task_id = 1;
SELECT task_id, updated_at > '2020-01-01' FROM tasks;
```

```sql check Even an explicit old value is overridden
UPDATE tasks SET updated_at = '1999-01-01' WHERE task_id = 2;
SELECT updated_at > '2020-01-01' FROM tasks WHERE task_id = 2;
```

```sql wrong
ALTER TABLE tasks ALTER COLUMN updated_at SET DEFAULT now();
```
