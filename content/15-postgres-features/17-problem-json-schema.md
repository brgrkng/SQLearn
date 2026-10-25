---
title: Validate the JSON
kind: problem
difficulty: hard
dataset: empty
hints:
  - "A CHECK constraint can use JSON operators: `payload ? 'email'`, `jsonb_typeof(payload -> 'age') = 'number'`."
---
`signups.payload` must always be a JSON **object** that has a string `email` and, if `age` is present, a **number** `age` of at least 13. Add a CHECK constraint (any name) that enforces this.

```sql setup
CREATE TABLE signups (id int PRIMARY KEY, payload jsonb NOT NULL);
INSERT INTO signups VALUES (1, '{"email": "a@x.io", "age": 30}'), (2, '{"email": "b@x.io"}');
```

```sql solution
ALTER TABLE signups ADD CONSTRAINT payload_valid CHECK (
  jsonb_typeof(payload) = 'object'
  AND jsonb_typeof(payload -> 'email') = 'string'
  AND (NOT payload ? 'age' OR (jsonb_typeof(payload -> 'age') = 'number' AND (payload ->> 'age')::numeric >= 13))
);
```

```sql check Valid documents are accepted
INSERT INTO signups VALUES (3, '{"email": "c@x.io", "age": 13}'), (4, '{"email": "d@x.io", "plan": "pro"}') RETURNING id;
```

```sql check Missing email is rejected
INSERT INTO signups VALUES (5, '{"age": 40}');
```

```sql check Too young is rejected
INSERT INTO signups VALUES (6, '{"email": "e@x.io", "age": 9}');
```

```sql check A text age is rejected
INSERT INTO signups VALUES (7, '{"email": "f@x.io", "age": "forty"}');
```

```sql check Arrays are rejected
INSERT INTO signups VALUES (8, '["email", "g@x.io"]');
```

```sql wrong
ALTER TABLE signups ADD CONSTRAINT payload_valid CHECK (payload ? 'email' AND (payload ->> 'age')::numeric >= 13);
```
