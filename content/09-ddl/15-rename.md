---
title: Rename for clarity
kind: drill
dataset: empty
hints:
  - "`ALTER TABLE tbl RENAME TO new_name;` and `ALTER TABLE new_name RENAME COLUMN old TO new;`"
---
Rename the table `cust` to `clients`, and its column `nm` to `full_name`. The data must be kept.

```sql setup
CREATE TABLE cust (id int PRIMARY KEY, nm text NOT NULL);
INSERT INTO cust VALUES (1, 'Ada Lovelace'), (2, 'Alan Turing');
```

```sql solution
ALTER TABLE cust RENAME TO clients;
ALTER TABLE clients RENAME COLUMN nm TO full_name;
```

```sql check The renamed table and column hold the data
SELECT id, full_name FROM clients;
```

```sql check The old name is gone
SELECT count(*) FROM information_schema.tables WHERE table_name = 'cust';
```

```sql wrong
CREATE TABLE clients (id int PRIMARY KEY, full_name text NOT NULL);
```
