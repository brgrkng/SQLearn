---
title: An events table
kind: test
dataset: empty
---
Create a table `audit_events` with:

- `event_id`: `bigint` identity, always generated, primary key
- `actor`: required `text`, at most **50** characters
- `action`: required `text`
- `happened_at`: required `timestamptz`, defaulting to the current time
- `details`: optional `jsonb`

```sql solution
CREATE TABLE audit_events (
  event_id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor       varchar(50) NOT NULL,
  action      text NOT NULL,
  happened_at timestamptz NOT NULL DEFAULT now(),
  details     jsonb
);
```

```sql check Columns
SELECT column_name, data_type, is_nullable, character_maximum_length FROM information_schema.columns
WHERE table_name = 'audit_events';
```

```sql check A minimal insert works
INSERT INTO audit_events (actor, action) VALUES ('ada', 'login') RETURNING event_id, happened_at IS NOT NULL;
```

```sql check Long actor names are rejected
INSERT INTO audit_events (actor, action) VALUES (repeat('x', 51), 'login');
```

```sql check Ids can't be supplied
INSERT INTO audit_events (event_id, actor, action) VALUES (10, 'ada', 'logout');
```

```sql wrong
CREATE TABLE audit_events (
  event_id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor       text NOT NULL,
  action      text NOT NULL,
  happened_at timestamptz NOT NULL DEFAULT now(),
  details     jsonb
);
```

```sql wrong
CREATE TABLE audit_events (
  event_id    int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor       varchar(50) NOT NULL,
  action      text NOT NULL,
  happened_at timestamptz NOT NULL DEFAULT now(),
  details     json
);
```
