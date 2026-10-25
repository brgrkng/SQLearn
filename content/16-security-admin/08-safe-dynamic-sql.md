---
title: Injection-proof dynamic SQL
kind: drill
dataset: empty
hints:
  - "`EXECUTE format('SELECT count(*) FROM %I', tbl) INTO n;` quotes the identifier safely."
---
Write a PL/pgSQL function `row_count(tbl text) RETURNS bigint` that returns the number of rows in the named table. It must treat `tbl` strictly as a **table name**, so a malicious argument can't run extra SQL.

```sql setup
CREATE TABLE fruits (name text);
INSERT INTO fruits VALUES ('apple'), ('pear'), ('plum');
CREATE TABLE "Mixed Case" (x int);
INSERT INTO "Mixed Case" VALUES (1), (2);
```

```sql solution
CREATE FUNCTION row_count(tbl text) RETURNS bigint LANGUAGE plpgsql AS $$
DECLARE
  n bigint;
BEGIN
  EXECUTE format('SELECT count(*) FROM %I', tbl) INTO n;
  RETURN n;
END
$$;
```

```sql check Normal table names work
SELECT row_count('fruits');
```

```sql check Names that need quoting work
SELECT row_count('Mixed Case');
```

```sql check An injection attempt fails instead of running
SELECT row_count('fruits; DROP TABLE fruits');
```

```sql check The table survived
SELECT count(*) FROM fruits;
```

```sql wrong
CREATE FUNCTION row_count(tbl text) RETURNS bigint LANGUAGE plpgsql AS $$
DECLARE
  n bigint;
BEGIN
  EXECUTE 'SELECT count(*) FROM ' || tbl INTO n;
  RETURN n;
END
$$;
```
