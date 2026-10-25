---
title: Only one primary email
kind: drill
dataset: empty
hints:
  - "A unique index with a WHERE clause: `CREATE UNIQUE INDEX ... ON user_emails (user_id) WHERE is_primary;`"
---
The setup creates `user_emails(email, user_id, is_primary)`. Users can have many emails, but **at most one primary** email each. Add the rule.

```sql setup
CREATE TABLE user_emails (email text PRIMARY KEY, user_id int NOT NULL, is_primary boolean NOT NULL DEFAULT false);
INSERT INTO user_emails VALUES ('ada@a.io', 1, true), ('ada@b.io', 1, false), ('alan@a.io', 2, true);
```

```sql solution
CREATE UNIQUE INDEX one_primary_email ON user_emails (user_id) WHERE is_primary;
```

```sql check More non-primary emails are fine
INSERT INTO user_emails VALUES ('ada@c.io', 1, false), ('ada@d.io', 1, false) RETURNING email;
```

```sql check A second primary email is rejected
INSERT INTO user_emails VALUES ('ada@e.io', 1, true);
```

```sql check Other users can still have a primary
INSERT INTO user_emails VALUES ('grace@a.io', 3, true) RETURNING email;
```

```sql wrong
CREATE UNIQUE INDEX one_primary_email ON user_emails (user_id, is_primary);
```

## Explanation
A plain unique index on `(user_id, is_primary)` also forbids a second **non-primary** email, because two `(1, false)` rows collide. The partial index only covers rows `WHERE is_primary`, so it constrains exactly the rows the rule is about.
