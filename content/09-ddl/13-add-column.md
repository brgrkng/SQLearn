---
title: Add a column
kind: drill
dataset: empty
hints:
  - "`ALTER TABLE members ADD COLUMN ... boolean NOT NULL DEFAULT true`"
---
The setup creates and fills a `members` table. Add a required `boolean` column `newsletter` that is **true** for every existing member and defaults to true for new ones.

```sql setup
CREATE TABLE members (member_id int PRIMARY KEY, name text NOT NULL);
INSERT INTO members VALUES (1, 'Ada'), (2, 'Alan'), (3, 'Grace');
```

```sql solution
ALTER TABLE members ADD COLUMN newsletter boolean NOT NULL DEFAULT true;
```

```sql check Existing members are subscribed
SELECT member_id, newsletter FROM members;
```

```sql check New members default to true
INSERT INTO members (member_id, name) VALUES (4, 'Edsger') RETURNING newsletter;
```

```sql check NULL isn't allowed
INSERT INTO members VALUES (5, 'Barbara', NULL);
```

```sql wrong
ALTER TABLE members ADD COLUMN newsletter boolean DEFAULT true;
```
