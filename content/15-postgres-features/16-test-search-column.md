---
title: A searchable column
kind: test
dataset: empty
---
Add a **generated** `tsvector` column named `search` to `docs` (English, built from `title` and `body` separated by a space) and a **GIN index** on it. Searching `search @@ websearch_to_tsquery('english', ...)` must then work.

```sql setup
CREATE TABLE docs (doc_id int PRIMARY KEY, title text NOT NULL, body text NOT NULL);
INSERT INTO docs VALUES (1, 'Backups', 'Restore drills every quarter.'), (2, 'Indexes', 'Composite indexes and covering indexes.'), (3, 'Vacuum', 'Autovacuum removes dead tuples.');
```

```sql solution
ALTER TABLE docs ADD COLUMN search tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;
CREATE INDEX docs_search_idx ON docs USING gin (search);
```

```sql check Searching works
SELECT doc_id FROM docs WHERE search @@ websearch_to_tsquery('english', 'restoring backup');
```

```sql check New rows are searchable automatically
INSERT INTO docs (doc_id, title, body) VALUES (4, 'Replicas', 'Streaming replication keeps standbys in sync.');
SELECT doc_id FROM docs WHERE search @@ websearch_to_tsquery('english', 'replica');
```

```sql check There is a GIN index
SELECT count(*) FROM pg_indexes WHERE tablename = 'docs' AND indexdef LIKE '%gin%';
```

```sql wrong
ALTER TABLE docs ADD COLUMN search tsvector;
UPDATE docs SET search = to_tsvector('english', title || ' ' || body);
CREATE INDEX docs_search_idx ON docs USING gin (search);
```
