---
title: Roles and privileges
kind: lesson
dataset: empty
cumulative: true
---
PostgreSQL controls access with **roles**. A role can be a user (it can log in), a group (other roles are members of it), or both. Objects belong to the role that created them, and other roles need **privileges** to use them.

```sql
CREATE TABLE salaries (employee text PRIMARY KEY, amount numeric NOT NULL);
INSERT INTO salaries VALUES ('Ada', 90000), ('Alan', 85000);

CREATE ROLE analyst NOLOGIN;            -- a group role
CREATE ROLE ada LOGIN IN ROLE analyst;  -- a user that's a member of analyst (no password needed here)
GRANT SELECT ON salaries TO analyst;

SET ROLE ada;
SELECT current_user, count(*) FROM salaries;
RESET ROLE;
```

`SET ROLE` switches the current session to another role, which makes it easy to test privileges. (Here you're connected as the superuser `postgres`, which can switch to any role.)

## Privileges

| Privilege | Allows |
|---|---|
| `SELECT`, `INSERT`, `UPDATE`, `DELETE` | the matching statement on a table or view (`UPDATE`/`SELECT` can be limited to columns) |
| `USAGE` on a schema | looking up objects in it at all |
| `CREATE` on a schema | creating objects in it |
| `EXECUTE` on a function | calling it |
| `CONNECT` on a database | connecting |

```sql error
SET ROLE ada;
DELETE FROM salaries;
```

`REVOKE` takes privileges away. `GRANT ... ON ALL TABLES IN SCHEMA public` covers existing tables, and `ALTER DEFAULT PRIVILEGES` covers future ones.

## Column privileges and views

Grant on specific columns, or (more commonly) grant on a **view** that exposes only what a role should see:

```sql
CREATE ROLE support NOLOGIN;
CREATE VIEW salary_bands AS
SELECT employee, CASE WHEN amount >= 88000 THEN 'high' ELSE 'standard' END AS band FROM salaries;
GRANT SELECT ON salary_bands TO support;

SET ROLE support;
SELECT * FROM salary_bands ORDER BY employee;
RESET ROLE;
```

The view runs with its **owner's** privileges, so `support` can read the bands without being able to read `salaries`.

## Principle of least privilege

- Applications should connect as a role that owns nothing and can only do what the app needs. Never connect them as a superuser.
- Have a separate owner role run migrations.
- Give humans read-only roles by default.

> **Dialect note.** SQL Server separates *logins* (server level) from *users* (database level) and has fixed roles like `db_datareader`. MySQL privileges are granted to `'user'@'host'`. Oracle has users and roles with system and object privileges. The `GRANT` / `REVOKE` statements themselves are standard and look much the same everywhere.
