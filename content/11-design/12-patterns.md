---
title: Denormalization and modelling patterns
kind: lesson
dataset: empty
cumulative: true
---
## Deliberate denormalization

Normalized schemas optimise for **correct writes**. Sometimes reads matter more, and you deliberately store a fact twice:

- **Cached aggregates:** `orders.total`, `posts.comment_count`. Reading them is cheap, but every write must keep them in sync (with a trigger, Module 14, or carefully in application code).
- **Reporting tables / materialized views:** pre-joined, pre-aggregated copies for dashboards, refreshed on a schedule (Module 14).
- **Snapshots of history:** `order_lines.unit_price` copies the price at the time of sale. That's not redundancy, because it's a different fact.

The rule: denormalize **on purpose**, for a measured reason, and decide how the copy stays correct. Never denormalize by accident.

## Hierarchies

An **adjacency list** (`parent_id` on each row) is simple, and recursive CTEs (Module 6) query it well. When you need fast "all descendants" queries on large trees, consider a **closure table** that stores every ancestor/descendant pair:

```sql
CREATE TABLE categories (category_id int PRIMARY KEY, name text NOT NULL, parent_id int REFERENCES categories);
INSERT INTO categories VALUES (1, 'Electronics', NULL), (2, 'Audio', 1), (3, 'Headphones', 2), (4, 'Books', NULL);

CREATE TABLE category_paths (ancestor int REFERENCES categories, descendant int REFERENCES categories, depth int NOT NULL,
                             PRIMARY KEY (ancestor, descendant));
INSERT INTO category_paths
WITH RECURSIVE p AS (
  SELECT category_id AS ancestor, category_id AS descendant, 0 AS depth FROM categories
  UNION ALL
  SELECT p.ancestor, c.category_id, p.depth + 1 FROM p JOIN categories c ON c.parent_id = p.descendant
)
SELECT * FROM p;

SELECT descendant, depth FROM category_paths WHERE ancestor = 1 ORDER BY depth, descendant;
```

A **materialized path** (`'1.2.3'`) is a third option. PostgreSQL's `ltree` extension supports it well.

## History: tracking change over time

To know what a value *was*, not just what it is, keep history rows with validity periods: `valid_from` and `valid_to`, or a `tstzrange`. This is the "SCD type 2" pattern you practised in Module 8. An exclusion constraint (Module 10) can guarantee the periods never overlap.

## Soft deletes

`deleted_at timestamptz` marks rows as deleted without removing them. It's useful for undo and auditing, but every query must remember `WHERE deleted_at IS NULL`, and unique constraints need partial indexes (`UNIQUE ... WHERE deleted_at IS NULL`). Consider an archive table instead.

## Patterns to avoid

**Polymorphic associations.** A `comments` table with `commentable_type` and `commentable_id` columns that point at posts *or* photos *or* videos. No foreign key can enforce that, so orphans creep in. Better options are a separate comments table per parent, or an **exclusive arc**: one nullable foreign key per parent type, plus a CHECK that exactly one is set:

```sql
CREATE TABLE posts  (post_id int PRIMARY KEY);
CREATE TABLE photos (photo_id int PRIMARY KEY);
CREATE TABLE comments (
  comment_id int PRIMARY KEY,
  post_id    int REFERENCES posts,
  photo_id   int REFERENCES photos,
  body       text NOT NULL,
  CHECK (num_nonnulls(post_id, photo_id) = 1)
);
SELECT 'exclusive arc created' AS status;
```

**Entity–attribute–value (EAV).** An `attributes(entity_id, name, value text)` table that stores anything. It gives up types, constraints and sane queries. If attributes truly vary, a `jsonb` column (Module 15) is usually better, and real columns are better still.

**Lookup values as magic strings everywhere.** For a fixed, small set of values, use a `CHECK (status IN (...))`, an enum, or a lookup table with a foreign key (best when the values carry attributes or change often).

> **Dialect note.** Closure tables, history tables and exclusive arcs work in any database. `num_nonnulls`, exclusion constraints and `ltree` are PostgreSQL features. In other databases you'd write the CHECK out longhand and enforce non-overlap with triggers.
