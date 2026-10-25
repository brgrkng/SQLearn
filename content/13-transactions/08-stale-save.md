---
title: A stale save
kind: drill
dataset: empty
hints:
  - "Same pattern as before. The `WHERE version = ...` condition makes a stale save change nothing."
---
Someone else saved document **1** while you were editing, so it's now at **version 5**. You still hold **version 4**. Write the optimistic save of your text `My edits` (expecting version 4, incrementing it) so that it **updates nothing** and returns no rows. The other person's version must survive.

```sql setup
CREATE TABLE docs (doc_id int PRIMARY KEY, body text NOT NULL, version int NOT NULL);
INSERT INTO docs VALUES (1, 'Their edits', 5);
```

```sql solution
UPDATE docs SET body = 'My edits', version = version + 1
WHERE doc_id = 1 AND version = 4
RETURNING doc_id, version;
```

```sql check The other person's save survives
SELECT doc_id, body, version FROM docs;
```

```sql wrong
UPDATE docs SET body = 'My edits', version = version + 1
WHERE doc_id = 1
RETURNING doc_id, version;
```
