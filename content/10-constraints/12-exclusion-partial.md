---
title: Exclusion constraints and partial unique indexes
kind: lesson
dataset: empty
cumulative: true
---
Some rules are about *combinations* of rows that ordinary UNIQUE can't express. PostgreSQL has two tools for them.

## Partial unique indexes: unique among some rows

"Each user may have **at most one active** subscription" (but any number of ended ones). A unique index with a `WHERE` clause only covers the rows matching it:

```sql
CREATE TABLE subscriptions (
  subscription_id int PRIMARY KEY,
  user_id int NOT NULL,
  plan    text NOT NULL,
  active  boolean NOT NULL
);
CREATE UNIQUE INDEX one_active_subscription ON subscriptions (user_id) WHERE active;

INSERT INTO subscriptions VALUES (1, 7, 'basic', false), (2, 7, 'pro', true), (3, 8, 'pro', true);
SELECT * FROM subscriptions;
```

```sql error
INSERT INTO subscriptions VALUES (4, 7, 'team', true);
```

The same trick enforces "one default address per customer", "one primary email per user" and "unique username among non-deleted accounts" (`WHERE deleted_at IS NULL`).

## Exclusion constraints: no overlaps

"A room can't be booked twice at the same time" is not about equal values but about **overlapping ranges**. An exclusion constraint generalises UNIQUE: no two rows may have values that all satisfy the given operators. `&&` means "overlaps" for range types:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;   -- lets GiST indexes handle plain = on integers

CREATE TABLE bookings (
  booking_id int PRIMARY KEY,
  room_id    int NOT NULL,
  during     tstzrange NOT NULL,
  EXCLUDE USING gist (room_id WITH =, during WITH &&)
);

INSERT INTO bookings VALUES
  (1, 101, '[2026-03-02 09:00, 2026-03-02 10:00)'),
  (2, 101, '[2026-03-02 10:00, 2026-03-02 11:00)'),   -- back-to-back is fine
  (3, 102, '[2026-03-02 09:30, 2026-03-02 10:30)');   -- different room
SELECT * FROM bookings;
```

```sql error
INSERT INTO bookings VALUES (4, 101, '[2026-03-02 09:30, 2026-03-02 09:45)');
```

The constraint reads as "no two rows with equal `room_id` **and** overlapping `during`". Ranges like `[start, end)` include the start and exclude the end, so back-to-back bookings don't overlap. Range types get a fuller treatment in Module 15.

Trying to enforce these rules in application code ("check for an overlap, then insert") is a race condition: two requests can both check, both see no conflict, and both insert. A constraint can't be raced.

> **Dialect note.** Partial (filtered) unique indexes exist in SQL Server (`WHERE` on the index) and SQLite. MySQL and Oracle emulate them with expression indexes. Exclusion constraints are PostgreSQL-only. Elsewhere, overlap rules need triggers with careful locking.
