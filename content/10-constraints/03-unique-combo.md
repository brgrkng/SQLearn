---
title: Usernames per workspace
kind: drill
dataset: empty
hints:
  - "A table-level `UNIQUE (workspace_id, username)` constraint."
  - "Emails are unique across everyone: a column-level `UNIQUE`."
---
Create `accounts` with `account_id` (`int`, primary key), `workspace_id` (required `int`), `username` (required `text`) and `email` (optional `text`). Usernames must be unique **within a workspace** (two workspaces can each have an `alex`). Emails, when present, must be unique **across all workspaces**.

```sql solution
CREATE TABLE accounts (
  account_id   int PRIMARY KEY,
  workspace_id int NOT NULL,
  username     text NOT NULL,
  email        text UNIQUE,
  UNIQUE (workspace_id, username)
);
```

```sql check Same username in different workspaces is fine
INSERT INTO accounts VALUES (1, 1, 'alex', 'a@x.io'), (2, 2, 'alex', 'b@x.io') RETURNING account_id;
```

```sql check Same username in one workspace is rejected
INSERT INTO accounts VALUES (3, 1, 'sam', NULL), (4, 1, 'sam', NULL);
```

```sql check Duplicate emails are rejected
INSERT INTO accounts VALUES (5, 3, 'kim', 'k@x.io'), (6, 4, 'lee', 'k@x.io');
```

```sql check Many accounts may have no email
INSERT INTO accounts VALUES (7, 5, 'a', NULL), (8, 5, 'b', NULL), (9, 6, 'c', NULL) RETURNING account_id;
```

```sql wrong
CREATE TABLE accounts (
  account_id   int PRIMARY KEY,
  workspace_id int NOT NULL,
  username     text NOT NULL UNIQUE,
  email        text UNIQUE
);
```

```sql wrong
CREATE TABLE accounts (
  account_id   int PRIMARY KEY,
  workspace_id int NOT NULL,
  username     text NOT NULL,
  email        text,
  UNIQUE (workspace_id, username, email)
);
```
