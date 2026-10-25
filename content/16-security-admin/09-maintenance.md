---
title: VACUUM, statistics and monitoring
kind: lesson
---
## VACUUM

Because of MVCC (Module 13), `UPDATE` and `DELETE` leave **dead row versions** behind. `VACUUM` reclaims their space for reuse and updates the *visibility map* that index-only scans rely on. `ANALYZE` refreshes the planner's statistics. The **autovacuum** daemon runs both automatically, based on how much each table changes.

```sql
UPDATE orders SET status = status WHERE order_date < '2023-01-01';
SELECT relname, n_live_tup, n_dead_tup FROM pg_stat_user_tables WHERE relname = 'orders';
```

```sql
VACUUM (VERBOSE, ANALYZE) orders;
```

```sql
SELECT relname, n_live_tup, n_dead_tup, last_vacuum IS NOT NULL AS vacuumed
FROM pg_stat_user_tables WHERE relname = 'orders';
```

(Each example here runs on a fresh copy of the database, so the counts in the third box don't include the second box's VACUUM. Run the update and then the VACUUM together in one box to see the effect.)

When things go wrong:

- **Bloat.** Tables and indexes grow because dead rows aren't cleaned up fast enough, often because a long-running transaction holds back the cleanup horizon. Find old transactions in `pg_stat_activity`.
- **Wraparound.** PostgreSQL has to "freeze" old rows before transaction ids wrap around. Autovacuum handles this, but disabling autovacuum is a classic way to get a database that stops accepting writes.
- `VACUUM FULL` rewrites a table to shrink it on disk, but it locks the table exclusively. Prefer tools like `pg_repack` on live systems.

`VACUUM` can't run inside a transaction block, so run it as a statement on its own.

## Finding problems with pg_stat views

PostgreSQL counts everything:

```sql
SELECT relname, seq_scan, idx_scan, n_tup_ins, n_tup_upd, n_tup_del
FROM pg_stat_user_tables ORDER BY relname;
```

```sql
SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes ORDER BY idx_scan, indexrelname;
```

| View | Answers |
|---|---|
| `pg_stat_activity` | What is running right now? What is waiting, and on what? |
| `pg_stat_user_tables` | Which tables get sequential scans? When were they last vacuumed? |
| `pg_stat_user_indexes` | Which indexes are never used (and are only slowing down writes)? |
| `pg_stat_statements` (extension) | Which queries take the most total time? |
| `pg_locks` | Who holds which locks? |

```sql
SELECT pg_size_pretty(pg_total_relation_size('orders')) AS orders_total,
       pg_size_pretty(pg_relation_size('orders'))       AS orders_heap,
       pg_size_pretty(pg_indexes_size('orders'))        AS orders_indexes;
```

> **Dialect note.** Only PostgreSQL needs `VACUUM`. Other engines handle old row versions differently: SQL Server and MySQL keep them in undo/version stores, and Oracle in undo segments. Every database exposes similar monitoring views: DMVs in SQL Server, `performance_schema` and `sys` in MySQL, and `V$` views in Oracle.
