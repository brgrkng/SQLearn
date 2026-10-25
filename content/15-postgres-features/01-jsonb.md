---
title: JSONB
kind: lesson
dataset: empty
cumulative: true
---
`jsonb` stores JSON in a parsed binary form: it's validated on input, has fast access to keys, and can be indexed. (The older `json` type stores the raw text, and is only useful when you must preserve formatting or key order.)

```sql
CREATE TABLE events (
  event_id int PRIMARY KEY,
  payload  jsonb NOT NULL
);
INSERT INTO events VALUES
  (1, '{"type": "signup", "user": {"id": 7, "plan": "pro"}, "tags": ["web", "promo"]}'),
  (2, '{"type": "purchase", "user": {"id": 7}, "amount": 49.5, "items": [{"sku": "PEN", "qty": 2}, {"sku": "INK", "qty": 1}]}'),
  (3, '{"type": "purchase", "user": {"id": 9}, "amount": 12, "items": [{"sku": "PAD", "qty": 3}]}');
SELECT * FROM events;
```

## Getting values out

| Operator | Returns | Example |
|---|---|---|
| `->` | jsonb | `payload -> 'user'` |
| `->>` | text | `payload ->> 'type'` |
| `#>` / `#>>` | jsonb / text at a path | `payload #>> '{user,id}'` |

```sql
SELECT event_id,
       payload ->> 'type'              AS type,
       payload -> 'user' ->> 'id'      AS user_id,
       (payload ->> 'amount')::numeric AS amount,
       payload #>> '{items,0,sku}'     AS first_sku
FROM events;
```

`->>` returns **text**, so cast it before comparing as a number (`(payload ->> 'amount')::numeric > 20`).

## Filtering

`@>` asks "does the left document **contain** the right one?":

```sql
SELECT event_id FROM events WHERE payload @> '{"type": "purchase", "user": {"id": 7}}';
```

`?` tests whether a key exists (`payload ? 'amount'`). **jsonpath** expresses more complex conditions:

```sql
SELECT event_id FROM events WHERE payload @? '$.items[*] ? (@.qty >= 3)';
```

## Expanding arrays and objects into rows

```sql
SELECT e.event_id, item ->> 'sku' AS sku, (item ->> 'qty')::int AS qty
FROM events e, jsonb_array_elements(e.payload -> 'items') AS item;
```

`jsonb_each(obj)` turns an object into key/value rows, and `jsonb_object_keys(obj)` lists its keys.

## Building JSON

```sql
SELECT payload -> 'user' ->> 'id' AS user_id,
       jsonb_agg(jsonb_build_object('event', event_id, 'type', payload ->> 'type') ORDER BY event_id) AS history
FROM events
GROUP BY 1
ORDER BY 1;
```

This is handy for APIs: one row per entity, with its children nested as JSON.

## Changing documents

```sql
UPDATE events SET payload = jsonb_set(payload, '{user,plan}', '"team"') WHERE event_id = 1;
UPDATE events SET payload = payload || '{"source": "import"}' WHERE event_id = 3;   -- merge keys
UPDATE events SET payload = payload - 'tags' WHERE event_id = 1;                    -- remove a key
SELECT event_id, payload FROM events ORDER BY event_id;
```

## Indexing

A GIN index makes `@>`, `?` and jsonpath filters fast across millions of documents:

```sql
CREATE INDEX events_payload_idx ON events USING gin (payload jsonb_path_ops);
SELECT count(*) FROM events WHERE payload @> '{"type": "purchase"}';
```

For one frequently filtered field, a B-tree **expression index** such as `((payload ->> 'type'))` is smaller and supports ranges and sorting.

## When to use JSONB

It's good for payloads you store and return mostly whole, such as webhook bodies, settings and per-tenant custom fields, and for attributes that genuinely vary from row to row. If you filter, join or constrain on a field regularly, it probably deserves to be a real column. You can promote it later with a generated column: `amount numeric GENERATED ALWAYS AS ((payload ->> 'amount')::numeric) STORED`.

> **Dialect note.** MySQL has a `JSON` type with `->` / `->>` operators and generated-column indexing. SQL Server stores JSON as text, with `JSON_VALUE`, `OPENJSON` and `FOR JSON` (and a native `json` type in 2025). Oracle has `JSON` columns and `JSON_TABLE`. PostgreSQL's `jsonb` with GIN indexing is among the most capable.
