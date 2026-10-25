---
title: Unguessable ids
kind: drill
dataset: empty
hints:
  - "`id uuid PRIMARY KEY DEFAULT gen_random_uuid()`"
---
API keys mustn't reveal how many exist, so they use random UUIDs. Create `api_keys` with `id` (`uuid`, primary key, defaulting to a random UUID), `label` (required `text`) and `revoked` (required `boolean`, default `false`).

```sql solution
CREATE TABLE api_keys (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label   text NOT NULL,
  revoked boolean NOT NULL DEFAULT false
);
```

```sql check Ids are generated, distinct UUIDs
INSERT INTO api_keys (label) VALUES ('ci'), ('laptop'), ('phone');
SELECT count(DISTINCT id), min(length(id::text)), bool_and(NOT revoked) FROM api_keys;
```

```sql check The id is a uuid column
SELECT data_type FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'id';
```

```sql wrong
CREATE TABLE api_keys (
  id      text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  label   text NOT NULL,
  revoked boolean NOT NULL DEFAULT false
);
```
