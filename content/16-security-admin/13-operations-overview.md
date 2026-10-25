---
title: "Operations overview: backups, replication, HA"
kind: lesson
---
These topics are mostly configuration and tooling rather than SQL, so this is a map with pointers rather than a practice module. Every one of them matters before you run a database in production.

## Backups and restores

- **Logical backups** with `pg_dump` / `pg_restore`: SQL or archive files of one database. They're portable across versions and good for smaller databases and migrations, but slow to restore at scale.
- **Physical backups** with `pg_basebackup` plus continuous **WAL archiving**: a copy of the data files plus every change since. This enables **point-in-time recovery** (PITR): restore to 14:32:05, just before someone ran `DELETE` without a `WHERE`.
- Tools: pgBackRest, Barman, WAL-G. Managed services (RDS, Cloud SQL, Supabase, Neon) do this for you.
- **A backup you haven't restored is not a backup.** Rehearse restores regularly, and time them.

## Replication

- **Streaming replication** ships the write-ahead log to **standby** servers that replay it. Standbys can serve read-only queries (*hot standby*) and be promoted if the primary fails.
- **Synchronous** replication waits for a standby to confirm each commit: no data loss on failover, but higher commit latency. **Asynchronous** replication is faster but can lose the last few transactions.
- **Logical replication** (publications and subscriptions) replicates chosen tables, row by row. It's useful for upgrades with minimal downtime, feeding analytics systems, and partial copies.

## High availability

Automatic failover needs something to detect failure, promote a standby and redirect clients without creating two primaries (*split brain*). That's the job of Patroni (with etcd or Consul) and of managed services. Connection routing usually goes through a proxy or DNS.

## Connection pooling

Each PostgreSQL connection is a separate process, with memory overhead. Thousands of idle application connections hurt. **PgBouncer** (or a pooler built into your platform) multiplexes many client connections onto a few server connections. *Transaction pooling* is the most efficient mode, but it breaks session-level features such as `SET`, advisory locks and prepared statements unless you're careful.

## Configuration essentials

A few settings matter most: `shared_buffers` (often around 25% of RAM), `work_mem` (memory per sort or hash operation, multiplied across concurrent queries), `maintenance_work_mem`, `effective_cache_size`, `max_connections`, and the autovacuum and checkpoint settings. Tools like PGTune give a starting point, and monitoring tells you what to adjust. `SHOW work_mem;` and `pg_settings` show the current values.

## Upgrades

Minor versions (18.1 to 18.2) are drop-in binary replacements. Apply them promptly for security fixes. Major versions (17 to 18) need `pg_upgrade` (fast, in place) or logical replication to a new server (minimal downtime). Test your application against the new version first.

## Where to learn more

- The PostgreSQL documentation, especially the *Server Administration* part: postgresql.org/docs
- *PostgreSQL 14 Internals* by Egor Rogov (free online): how MVCC, WAL, locks and the planner really work
- The pgBackRest and Patroni documentation, for backups and HA in practice
- Your cloud provider's PostgreSQL guides, if you use a managed service
