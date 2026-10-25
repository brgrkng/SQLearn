---
title: Transactions and concurrency
summary: ACID, BEGIN/COMMIT/ROLLBACK and savepoints; MVCC and isolation levels; anomalies such as lost updates and write skew; row locks, SKIP LOCKED queues, deadlocks and optimistic concurrency.
---
Databases serve many users at once, and things fail halfway through. **Transactions** make a group of changes all-or-nothing, and **isolation** decides what concurrent transactions can see of each other's work.

The database in your browser has a single connection, so it can't run two truly concurrent sessions. The concurrency lessons walk through interleavings step by step (T1 and T2 side by side) using real PostgreSQL behaviour, and the exercises practise the patterns that make concurrent code safe.
