---
title: Meeting rooms
kind: test
dataset: empty
---
Create `room_bookings` with `booking_id` (identity primary key), `room` (required `text`), `booked_by` (required `text`) and `during` (required `tsrange`). Rules: no two bookings of the **same room** may overlap, and every booking must last **at least 15 minutes** (`upper(during) - lower(during) >= interval '15 minutes'`).

```sql solution
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE room_bookings (
  booking_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room       text NOT NULL,
  booked_by  text NOT NULL,
  during     tsrange NOT NULL CHECK (upper(during) - lower(during) >= interval '15 minutes'),
  EXCLUDE USING gist (room WITH =, during WITH &&)
);
```

```sql check Valid bookings are accepted
INSERT INTO room_bookings (room, booked_by, during) VALUES
  ('Ada', 'x', '[2026-03-02 09:00, 2026-03-02 10:00)'),
  ('Ada', 'y', '[2026-03-02 10:00, 2026-03-02 10:15)'),
  ('Turing', 'z', '[2026-03-02 09:30, 2026-03-02 11:00)')
RETURNING booking_id;
```

```sql check Overlaps in the same room are rejected
INSERT INTO room_bookings (room, booked_by, during) VALUES
  ('Ada', 'x', '[2026-03-02 09:00, 2026-03-02 10:00)'),
  ('Ada', 'w', '[2026-03-02 09:45, 2026-03-02 10:30)');
```

```sql check Ten-minute bookings are rejected
INSERT INTO room_bookings (room, booked_by, during) VALUES ('Hopper', 'v', '[2026-03-02 09:00, 2026-03-02 09:10)');
```

```sql wrong
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE room_bookings (
  booking_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room       text NOT NULL,
  booked_by  text NOT NULL,
  during     tsrange NOT NULL,
  EXCLUDE USING gist (room WITH =, during WITH &&)
);
```

```sql wrong
CREATE TABLE room_bookings (
  booking_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room       text NOT NULL,
  booked_by  text NOT NULL,
  during     tsrange NOT NULL CHECK (upper(during) - lower(during) >= interval '15 minutes'),
  UNIQUE (room, during)
);
```
