---
title: Build a closure table
kind: problem
difficulty: hard
dataset: empty
hints:
  - Every node is its own ancestor at depth 0.
  - A recursive CTE that carries the starting node produces every (ancestor, descendant, depth) triple.
---
The setup creates an adjacency-list `folders(folder_id, name, parent_id)`. Create `folder_paths(ancestor, descendant, depth)` with primary key `(ancestor, descendant)` and foreign keys to `folders`, and fill it with **every ancestor/descendant pair**, including each folder paired with itself at depth 0.

```sql setup
CREATE TABLE folders (folder_id int PRIMARY KEY, name text NOT NULL, parent_id int REFERENCES folders);
INSERT INTO folders VALUES (1, 'root', NULL), (2, 'docs', 1), (3, 'photos', 1), (4, '2025', 3), (5, 'summer', 4), (6, 'cv', 2);
```

```sql solution
CREATE TABLE folder_paths (
  ancestor   int REFERENCES folders,
  descendant int REFERENCES folders,
  depth      int NOT NULL,
  PRIMARY KEY (ancestor, descendant)
);
INSERT INTO folder_paths
WITH RECURSIVE p AS (
  SELECT folder_id AS ancestor, folder_id AS descendant, 0 AS depth FROM folders
  UNION ALL
  SELECT p.ancestor, f.folder_id, p.depth + 1 FROM p JOIN folders f ON f.parent_id = p.descendant
)
SELECT ancestor, descendant, depth FROM p;
```

```sql check Every path
SELECT ancestor, descendant, depth FROM folder_paths;
```

```sql check Everything under photos, in one indexed lookup
SELECT f.name FROM folder_paths fp JOIN folders f ON f.folder_id = fp.descendant WHERE fp.ancestor = 3 AND fp.depth > 0;
```

```sql check Paths are unique
INSERT INTO folder_paths VALUES (1, 1, 0);
```

```sql wrong
CREATE TABLE folder_paths (ancestor int REFERENCES folders, descendant int REFERENCES folders, depth int NOT NULL, PRIMARY KEY (ancestor, descendant));
INSERT INTO folder_paths SELECT parent_id, folder_id, 1 FROM folders WHERE parent_id IS NOT NULL;
```
