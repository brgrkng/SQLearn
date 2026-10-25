---
title: Full-text search
kind: lesson
dataset: empty
cumulative: true
---
`LIKE '%run%'` matches `run` but also `brunch`. It misses `running` vs `runs` unless you spell every form out, and it can't rank results. **Full-text search** understands words.

```sql
SELECT to_tsvector('english', 'The runners were running quickly to the finish lines');
```

A `tsvector` is the normalised words of a document (*lexemes*), with stop words like "the" removed and words reduced to their stem ("running" becomes "run"). A `tsquery` is a search expression. `@@` tests whether a document matches a query:

```sql
SELECT to_tsvector('english', 'The runners were running quickly') @@ to_tsquery('english', 'run & quick') AS matches;
```

## Building queries from user input

`to_tsquery` needs operators (`&`, `|`, `!`, `<->` for "followed by"), and it errors on stray punctuation. For a search box, use:

- `plainto_tsquery('english', 'quick runners')`: all the words (AND)
- `websearch_to_tsquery('english', '"finish line" -marathon or sprint')`: Google-like syntax with quotes, `-` and `or`

## A searchable table

```sql
CREATE TABLE posts (
  post_id int PRIMARY KEY,
  title   text NOT NULL,
  body    text NOT NULL,
  search  tsvector GENERATED ALWAYS AS (
            setweight(to_tsvector('english', title), 'A') || setweight(to_tsvector('english', body), 'B')
          ) STORED
);
CREATE INDEX posts_search_idx ON posts USING gin (search);

INSERT INTO posts (post_id, title, body) VALUES
  (1, 'Indexing strategies', 'Composite indexes speed up queries that filter on several columns.'),
  (2, 'Query planning', 'The planner estimates costs and chooses between index scans and sequential scans.'),
  (3, 'Backups', 'Test your restores. An untested backup is not a backup.'),
  (4, 'Covering indexes', 'An index that includes every column a query needs avoids reading the table.');

SELECT post_id, title, round(ts_rank(search, q)::numeric, 3) AS rank
FROM posts, websearch_to_tsquery('english', 'index queries') AS q
WHERE search @@ q
ORDER BY rank DESC, post_id;
```

- The **generated column** keeps the `tsvector` up to date, and the **GIN index** makes `@@` fast.
- `setweight` labels title words `A` and body words `B`, and `ts_rank` scores `A` matches higher, so titles count more.
- `ts_headline` produces a snippet with the matching words highlighted:

```sql
SELECT ts_headline('english', body, websearch_to_tsquery('english', 'restore backup')) FROM posts WHERE post_id = 3;
```

## Limits

PostgreSQL full-text search is excellent for site search, documentation and support tickets: up to millions of documents, with no extra infrastructure. Dedicated engines (Elasticsearch, OpenSearch, Meilisearch) add typo tolerance, faceting and relevance tuning at larger scale. `pg_trgm` (Module 12) adds fuzzy matching for typos and partial words.

> **Dialect note.** MySQL has `FULLTEXT` indexes with `MATCH ... AGAINST`, SQL Server has Full-Text Search with `CONTAINS` and `FREETEXT`, and Oracle has Oracle Text. All are configured very differently from PostgreSQL's `tsvector` approach, but the concepts (stemming, stop words, ranking) are shared.
