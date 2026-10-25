---
title: Private notes
kind: test
dataset: empty
---
The setup creates `notes` and a role `app` with full table privileges. Using row-level security keyed on the setting `app.user_name`, make sure a session running as `app` can **read, insert, update and delete only its own notes** (`owner` = the setting).

```sql setup
CREATE TABLE notes (note_id int PRIMARY KEY, owner text NOT NULL, body text NOT NULL);
INSERT INTO notes VALUES (1, 'ada', 'one'), (2, 'alan', 'two'), (3, 'ada', 'three');
CREATE ROLE app NOLOGIN;
GRANT SELECT, INSERT, UPDATE, DELETE ON notes TO app;
```

```sql solution
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_notes ON notes
  USING (owner = current_setting('app.user_name'))
  WITH CHECK (owner = current_setting('app.user_name'));
```

```sql check Ada sees her notes
SET ROLE app;
SET app.user_name = 'ada';
SELECT note_id FROM notes;
```

```sql check Ada can't delete Alan's note
SET ROLE app;
SET app.user_name = 'ada';
DELETE FROM notes WHERE note_id = 2;
RESET ROLE;
SELECT count(*) FROM notes;
```

```sql check Ada can edit and add her own notes
SET ROLE app;
SET app.user_name = 'ada';
UPDATE notes SET body = 'edited' WHERE note_id = 1;
INSERT INTO notes VALUES (8, 'ada', 'four');
SELECT note_id, body FROM notes;
```

```sql check Ada can't write a note as Alan
SET ROLE app;
SET app.user_name = 'ada';
INSERT INTO notes VALUES (9, 'alan', 'forged');
```

```sql wrong
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_notes ON notes FOR SELECT USING (owner = current_setting('app.user_name'));
```
