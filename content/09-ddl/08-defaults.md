---
title: Sensible defaults
kind: drill
dataset: empty
hints:
  - "`status text NOT NULL DEFAULT 'open'`, `opened_at timestamptz NOT NULL DEFAULT now()`"
---
Create `tickets` with:

- `ticket_id`: an always-generated identity primary key
- `subject`: required `text`
- `status`: required `text` that defaults to `open`
- `opened_at`: required `timestamptz` that defaults to the current time

```sql solution
CREATE TABLE tickets (
  ticket_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject   text NOT NULL,
  status    text NOT NULL DEFAULT 'open',
  opened_at timestamptz NOT NULL DEFAULT now()
);
```

```sql check Defaults fill in
INSERT INTO tickets (subject) VALUES ('Printer on fire') RETURNING ticket_id, status, opened_at IS NOT NULL;
```

```sql check The time defaults to now
INSERT INTO tickets (subject) VALUES ('Coffee machine') RETURNING abs(extract(epoch FROM opened_at - now())) < 5;
```

```sql check Column types
SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'tickets';
```

```sql wrong
CREATE TABLE tickets (
  ticket_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject   text NOT NULL,
  status    text DEFAULT 'open',
  opened_at timestamp NOT NULL DEFAULT now()
);
```
