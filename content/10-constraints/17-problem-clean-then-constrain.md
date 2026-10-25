---
title: Clean up, then constrain
kind: problem
difficulty: medium
dataset: empty
hints:
  - Adding the constraint fails while bad rows exist. Fix the data first.
  - "`UPDATE contacts SET email = NULL WHERE email NOT LIKE '%_@_%'`, then `ALTER TABLE ... ADD CONSTRAINT ... CHECK (...)`."
---
`contacts.email` contains junk. Set every email that **doesn't contain an `@` with at least one character on each side** to NULL. Then add a constraint (named anything) so that future emails must match that same rule. NULL is still allowed.

```sql setup
CREATE TABLE contacts (contact_id int PRIMARY KEY, email text);
INSERT INTO contacts VALUES (1, 'ada@example.com'), (2, 'not an email'), (3, NULL), (4, '@example.com'), (5, 'alan@'), (6, 'grace@navy.mil');
```

```sql solution
UPDATE contacts SET email = NULL WHERE email NOT LIKE '%_@_%';
ALTER TABLE contacts ADD CONSTRAINT email_has_at CHECK (email LIKE '%_@_%');
```

```sql check Junk emails were cleared, good ones kept
SELECT contact_id, email FROM contacts;
```

```sql check New junk is rejected
INSERT INTO contacts VALUES (7, 'nope');
```

```sql check Good emails and NULL are accepted
INSERT INTO contacts VALUES (8, 'x@y.z'), (9, NULL) RETURNING contact_id;
```

```sql wrong
DELETE FROM contacts WHERE email NOT LIKE '%_@_%';
ALTER TABLE contacts ADD CONSTRAINT email_has_at CHECK (email LIKE '%_@_%');
```
