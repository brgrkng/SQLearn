---
title: No double bookings
kind: drill
dataset: empty
hints:
  - "`CREATE EXTENSION IF NOT EXISTS btree_gist;`"
  - "`EXCLUDE USING gist (desk_id WITH =, during WITH &&)`"
---
Create `desk_bookings` with `booking_id` (`int`, primary key), `desk_id` (required `int`) and `during` (required `tstzrange`). The same desk must **never** have overlapping bookings. Back-to-back bookings and different desks are fine.

```sql solution
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE desk_bookings (
  booking_id int PRIMARY KEY,
  desk_id    int NOT NULL,
  during     tstzrange NOT NULL,
  EXCLUDE USING gist (desk_id WITH =, during WITH &&)
);
```

```sql check Back-to-back and different desks are fine
INSERT INTO desk_bookings VALUES
  (1, 1, '[2026-03-02 09:00, 2026-03-02 12:00)'),
  (2, 1, '[2026-03-02 12:00, 2026-03-02 17:00)'),
  (3, 2, '[2026-03-02 10:00, 2026-03-02 11:00)')
RETURNING booking_id;
```

```sql check Overlaps on the same desk are rejected
INSERT INTO desk_bookings VALUES (4, 1, '[2026-03-02 08:00, 2026-03-02 09:30)');
```

```sql wrong
CREATE TABLE desk_bookings (
  booking_id int PRIMARY KEY,
  desk_id    int NOT NULL,
  during     tstzrange NOT NULL,
  UNIQUE (desk_id, during)
);
```
