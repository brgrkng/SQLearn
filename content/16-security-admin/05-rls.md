---
title: Row-level security and SQL injection
kind: lesson
dataset: empty
cumulative: true
---
## Row-level security

Privileges are per table. **Row-level security** (RLS) restricts *which rows* a role can see or change, with policies evaluated on every query. It's how multi-tenant apps keep customers' data apart, and how Supabase protects data accessed directly from browsers.

```sql
CREATE TABLE notes (note_id int PRIMARY KEY, owner text NOT NULL, body text NOT NULL);
INSERT INTO notes VALUES (1, 'ada', 'Buy milk'), (2, 'alan', 'Fix the bombe'), (3, 'ada', 'Write paper');

CREATE ROLE app_user NOLOGIN;
GRANT SELECT, INSERT, UPDATE, DELETE ON notes TO app_user;

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_notes ON notes
  USING (owner = current_setting('app.user_name'))
  WITH CHECK (owner = current_setting('app.user_name'));

SET ROLE app_user;
SET app.user_name = 'ada';
SELECT * FROM notes ORDER BY note_id;
RESET ROLE;
```

- `USING (...)` filters which existing rows are visible (for SELECT, UPDATE, DELETE).
- `WITH CHECK (...)` validates new or changed rows (for INSERT, UPDATE).
- Once RLS is enabled, a table with **no** policies shows **nothing** to ordinary roles. Access is denied by default.
- Table owners and superusers bypass RLS unless you `ALTER TABLE ... FORCE ROW LEVEL SECURITY`.

Here the current user's identity comes from a session setting the application sets after connecting. Supabase uses a function, `auth.uid()`, that reads it from the user's JWT.

```sql error
SET ROLE app_user;
SET app.user_name = 'ada';
INSERT INTO notes VALUES (4, 'alan', 'Forged note');
```

## SQL injection

**Never build SQL by concatenating user input.** If a login form builds:

```sql norun
SELECT * FROM users WHERE email = '' || input || '';
```

and someone types `' OR '1'='1`, the query becomes `... WHERE email = '' OR '1'='1'` and matches everyone. Worse inputs can drop tables.

The fix is **parameterised queries**: the SQL text is fixed, and values travel separately, so they are never parsed as SQL:

```sql norun
-- application code, any language
query("SELECT * FROM users WHERE email = $1", [input])
```

Inside PL/pgSQL, build dynamic SQL with `format('%I', identifier)` and `format('%L', literal)`, or with `EXECUTE ... USING`, never with plain `||`:

```sql
SELECT format('SELECT * FROM %I WHERE owner = %L', 'notes', 'O''Brien; DROP TABLE notes;--') AS safe_sql;
```

Least-privilege roles and RLS limit the damage if an injection does slip through. Parameters prevent it in the first place.

> **Dialect note.** SQL Server has row-level security via security policies and predicate functions. Oracle has Virtual Private Database. MySQL has no RLS, so you use views or application logic instead. Parameterised queries are supported by every driver in every language. Use them always.
