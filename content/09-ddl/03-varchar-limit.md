---
title: Country codes
kind: drill
dataset: empty
hints:
  - "`char(2)` pads short values with spaces. `varchar(2)` rejects longer ones and stores shorter ones as they are."
---
Create a table `countries` with `code` (**at most 2 characters**, primary key) and `name` (`text`, required). A three-letter code such as `GBR` must be rejected.

```sql solution
CREATE TABLE countries (code varchar(2) PRIMARY KEY, name text NOT NULL);
```

```sql check Two-letter codes work
INSERT INTO countries VALUES ('GB', 'United Kingdom'), ('KE', 'Kenya') RETURNING code;
```

```sql check Three-letter codes are rejected
INSERT INTO countries VALUES ('GBR', 'United Kingdom');
```

```sql check Name is required
INSERT INTO countries (code) VALUES ('FR');
```

```sql wrong
CREATE TABLE countries (code text PRIMARY KEY, name text NOT NULL);
```
