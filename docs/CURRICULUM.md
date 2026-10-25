# Curriculum

Every module follows the same shape: **lessons** (theory with runnable examples and dialect notes), **drills** (one idea at a time), a **test** (mixed, no hints), and **problems** (interview style, rated easy/medium/hard). Every graded exercise checks efficiency as well as correctness.

Certification syllabi (Oracle 1Z0-071, Microsoft DP-080/DP-300, PostgreSQL Associate) were used as a coverage checklist only. All wording, examples and questions are original.

Status: ✅ written and tested · ⏳ planned

## Part I: Querying

### 1. Querying a single table ✅
SELECT and expressions, aliases, integer division, concatenation, identifiers vs literals · WHERE, comparison operators, AND/OR precedence, IN, BETWEEN, half-open date ranges, LIKE/ILIKE · NULL, three-valued logic, IS [NOT] DISTINCT FROM, coalesce · ORDER BY, NULLS FIRST/LAST, LIMIT/OFFSET, FETCH … WITH TIES, deterministic ordering · DISTINCT, DISTINCT ON · **Cost:** the planner, EXPLAIN, seq vs index scan, sargable predicates, keyset pagination.
*7 lessons · 25 drills · 8-question test · 5 problems*

### 2. Functions and expressions ✅
Text functions (length, upper/lower, trim, substring, position, replace, split_part, format, regexp_*) · numeric functions and rounding, numeric vs float · dates and times: date, timestamp, timestamptz, interval, date arithmetic, extract/date_part, date_trunc, time zones, generate_series · CASE (simple and searched) · casting, implicit conversions · NULL-handling functions (nullif, coalesce, greatest/least) · **Cost:** functions on columns, expression indexes (preview).

### 3. Aggregation and grouping ✅
count(*) vs count(col) vs count(DISTINCT) · sum/avg/min/max and NULL behaviour · GROUP BY rules · HAVING vs WHERE · FILTER clause · string_agg, array_agg, bool_and/bool_or · percentile_cont/mode (ordered-set aggregates) · GROUPING SETS, ROLLUP, CUBE · pivoting with conditional aggregation · **Cost:** HashAggregate vs GroupAggregate, filtering before grouping.

### 4. Joins ✅
Why tables are split up · INNER JOIN, ON vs USING vs NATURAL · LEFT/RIGHT/FULL OUTER · conditions in ON vs WHERE with outer joins · CROSS JOIN · self-joins · joining many tables · semi-joins and anti-joins · fan-out: why joins duplicate rows, and why DISTINCT isn't the fix · non-equi joins · **Cost:** nested loop, hash join and merge join, indexing foreign keys.

### 5. Subqueries and set operations ✅
Scalar subqueries · IN / NOT IN (and the NULL trap) · EXISTS / NOT EXISTS · correlated subqueries · derived tables · LATERAL · ANY/ALL · UNION vs UNION ALL, INTERSECT, EXCEPT · **Cost:** correlated subquery vs join, NOT IN vs NOT EXISTS plans.

### 6. Common table expressions ✅
WITH for readability · chaining CTEs · MATERIALIZED / NOT MATERIALIZED · recursive CTEs: hierarchies (category trees, org charts), generating series, graph walks, cycle detection · **Cost:** CTE inlining, recursion depth.

### 7. Window functions ✅
OVER, PARTITION BY, ORDER BY · row_number, rank, dense_rank, ntile · running totals and moving averages · frames: ROWS vs RANGE vs GROUPS, frame exclusion · lag/lead, first_value/last_value/nth_value · top-N per group · gaps and islands · sessionization · percent_rank, cume_dist · WINDOW clause · **Cost:** sorts for windows, one window vs several.

## Part II: Changing data and designing databases

### 8. Modifying data ✅
INSERT (multi-row, INSERT … SELECT, DEFAULT) · UPDATE (with FROM) · DELETE (with USING), TRUNCATE · RETURNING · upsert with ON CONFLICT · MERGE · bulk operations · **Cost:** set-based vs row-by-row updates.

### 9. Data types and DDL ✅
CREATE TABLE · choosing types: integer sizes, numeric vs float, text vs varchar(n), boolean, date/time types, uuid, enum, arrays, jsonb (preview) · identity columns and sequences · DEFAULT, generated columns · ALTER TABLE, DROP, schemas · temporary tables.

### 10. Constraints and integrity ✅
NOT NULL · PRIMARY KEY (natural vs surrogate keys) · UNIQUE (and NULLs) · FOREIGN KEY with ON DELETE/UPDATE actions · CHECK · exclusion constraints · deferrable constraints · enforcing business rules in the database instead of the application. *Graded by behaviour checks (inserts that must succeed or fail).*

### 11. Database design and normalization ⏳
Requirements to entities · ER diagrams and cardinality (1:1, 1:N, M:N, junction tables) · functional dependencies · anomalies (insert, update, delete) · 1NF, 2NF, 3NF, BCNF, with 4NF briefly · when and how to denormalize · modelling patterns: hierarchies, history/audit tables, soft deletes, polymorphic associations (and their alternatives), EAV and why to avoid it · naming conventions · design case studies (library, booking system, marketplace). *Exercises: build schemas that pass behaviour checks.*

## Part III: Performance and production SQL

### 12. Indexes and query performance ⏳
How B-tree indexes work · reading EXPLAIN and EXPLAIN ANALYZE · seq, index, index-only and bitmap scans · composite index column order · covering indexes (INCLUDE) · partial and expression indexes · GIN/GiST/BRIN, and when · statistics and ANALYZE · cardinality misestimates · join order · the cost of indexes on writes · anti-patterns: leading-wildcard LIKE, OR across columns, implicit casts, functions on columns, N+1 queries, SELECT * · partitioning. *Exercises: "make this query fast" by rewriting it or adding an index.*

### 13. Transactions and concurrency ⏳
ACID · BEGIN/COMMIT/ROLLBACK, savepoints · MVCC: how PostgreSQL keeps old row versions · isolation levels and anomalies (dirty read, non-repeatable read, phantom, lost update, write skew) · row locks, SELECT … FOR UPDATE / SKIP LOCKED · deadlocks · optimistic concurrency. *Taught with step-through T1/T2 walkthroughs, since the in-browser database has a single connection.*

### 14. Views, functions and triggers ⏳
Views and updatable views · materialized views and refresh · SQL functions · PL/pgSQL: variables, control flow, exceptions · procedures · triggers (auditing, derived columns) and when not to use them.

### 15. Beyond relational: PostgreSQL power features ⏳
jsonb operators, jsonb_path, indexing JSON · arrays and unnest · range types · full-text search (tsvector, tsquery, ranking) · generate_series and calendar tables.

### 16. Security and administration essentials ⏳
Roles, GRANT/REVOKE, default privileges · row-level security policies · SQL injection and parameterized queries · VACUUM, ANALYZE and bloat · pg_stat views for finding slow queries · **Overview only, with links:** backup and restore (pg_dump, PITR), replication, high availability, connection pooling, server configuration.

## Part IV: Practice

### 17. Interview problem sets ⏳
About 60 original problems in three tiers, covering the patterns interviewers ask about: second-highest value, duplicates, top-N per group, running totals, consecutive streaks, gaps and islands, median, retention and cohorts, funnels, year-over-year growth, sessionization, pivots, hierarchy walks, and "find the bug in this query".

### 18. Capstone ⏳
Design a schema from a written brief, load it, answer business questions against it, and tune the slowest queries.

## Datasets

| Name | Used for | Status |
|---|---|---|
| `shop` | Querying, joins, aggregation, performance (50k orders, ~125k order lines) | ✅ |
| `hr` | Self-joins, recursive hierarchies, windows over salaries (300 employees, 5 levels) | ✅ |
| `analytics` | Events, subscriptions and referrals for time series, funnels, retention (2k users, 83k events) | ✅ |
| `empty` | DDL, constraints and design exercises | ✅ (built in) |
