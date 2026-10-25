---
title: Save only if unchanged
kind: drill
dataset: empty
hints:
  - "`UPDATE ... SET ..., version = version + 1 WHERE doc_id = 1 AND version = 4 RETURNING ...`"
---
You loaded document **1** at **version 4** and edited its body to `Final draft`. Save it using **optimistic concurrency**: update only if the document is still at version 4, increment the version, and return the `doc_id` and new `version`.

```sql setup
CREATE TABLE docs (doc_id int PRIMARY KEY, body text NOT NULL, version int NOT NULL);
INSERT INTO docs VALUES (1, 'Second draft', 4), (2, 'Notes', 9);
```

```sql solution
UPDATE docs SET body = 'Final draft', version = version + 1
WHERE doc_id = 1 AND version = 4
RETURNING doc_id, version;
```

```sql wrong
UPDATE docs SET body = 'Final draft', version = 4
WHERE doc_id = 1
RETURNING doc_id, version;
```
