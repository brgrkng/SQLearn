---
title: Containment
kind: drill
dataset: empty
hints:
  - "`payload @> '{\"plan\": \"pro\", \"flags\": {\"beta\": true}}'`"
---
Return the `account_id` of every account whose settings document has `plan` = `pro` **and** `flags.beta` = `true`. Use JSON containment.

```sql setup
CREATE TABLE accounts (account_id int PRIMARY KEY, settings jsonb NOT NULL);
INSERT INTO accounts VALUES
  (1, '{"plan": "pro", "flags": {"beta": true, "dark": false}}'),
  (2, '{"plan": "pro", "flags": {"beta": false}}'),
  (3, '{"plan": "basic", "flags": {"beta": true}}'),
  (4, '{"plan": "pro", "flags": {"beta": true}, "seats": 5}'),
  (5, '{"plan": "pro"}');
```

```sql solution
SELECT account_id FROM accounts WHERE settings @> '{"plan": "pro", "flags": {"beta": true}}';
```

```sql wrong
SELECT account_id FROM accounts WHERE settings @> '{"plan": "pro"}';
```
