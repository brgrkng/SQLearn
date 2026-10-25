---
title: Concert tickets
kind: test
dataset: empty
---
Design a ticketing schema with these tables (integer ids; everything required unless stated):

- `venues(venue_id, name)`
- `seats(seat_id, venue_id, label)`: a seat belongs to one venue, and its `label` (like `A12`) is unique **within a venue**
- `events(event_id, venue_id, title, starts_at)`
- `tickets(ticket_id, event_id, seat_id, price)`: price is positive, and each seat can be sold **at most once per event**

```sql solution
CREATE TABLE venues (venue_id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE seats (seat_id int PRIMARY KEY, venue_id int NOT NULL REFERENCES venues, label text NOT NULL, UNIQUE (venue_id, label));
CREATE TABLE events (event_id int PRIMARY KEY, venue_id int NOT NULL REFERENCES venues, title text NOT NULL, starts_at timestamptz NOT NULL);
CREATE TABLE tickets (
  ticket_id int PRIMARY KEY,
  event_id  int NOT NULL REFERENCES events,
  seat_id   int NOT NULL REFERENCES seats,
  price     numeric(8,2) NOT NULL CHECK (price > 0),
  UNIQUE (event_id, seat_id)
);
```

```sql check A small sold-out show
INSERT INTO venues VALUES (1, 'Hall');
INSERT INTO seats VALUES (1, 1, 'A1'), (2, 1, 'A2');
INSERT INTO events VALUES (1, 1, 'Opening night', '2026-05-01 20:00+00'), (2, 1, 'Matinee', '2026-05-02 14:00+00');
INSERT INTO tickets VALUES (1, 1, 1, 50), (2, 1, 2, 50), (3, 2, 1, 30);
SELECT count(*) FROM tickets;
```

```sql check A seat can't be sold twice for the same event
INSERT INTO venues VALUES (2, 'Club');
INSERT INTO seats VALUES (10, 2, 'B1');
INSERT INTO events VALUES (10, 2, 'Gig', '2026-06-01 21:00+00');
INSERT INTO tickets VALUES (10, 10, 10, 20), (11, 10, 10, 25);
```

```sql check Seat labels are unique within a venue, not globally
INSERT INTO venues VALUES (3, 'Arena'), (4, 'Theatre');
INSERT INTO seats VALUES (20, 3, 'C1'), (21, 4, 'C1');
SELECT count(*) FROM seats WHERE label = 'C1';
```

```sql check Duplicate labels in one venue are rejected
INSERT INTO venues VALUES (5, 'Barn');
INSERT INTO seats VALUES (30, 5, 'D1'), (31, 5, 'D1');
```

```sql check Free tickets are rejected
INSERT INTO venues VALUES (6, 'Park');
INSERT INTO seats VALUES (40, 6, 'E1');
INSERT INTO events VALUES (40, 6, 'Picnic', '2026-07-01 12:00+00');
INSERT INTO tickets VALUES (40, 40, 40, 0);
```

```sql wrong
CREATE TABLE venues (venue_id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE seats (seat_id int PRIMARY KEY, venue_id int NOT NULL REFERENCES venues, label text NOT NULL UNIQUE);
CREATE TABLE events (event_id int PRIMARY KEY, venue_id int NOT NULL REFERENCES venues, title text NOT NULL, starts_at timestamptz NOT NULL);
CREATE TABLE tickets (
  ticket_id int PRIMARY KEY, event_id int NOT NULL REFERENCES events, seat_id int NOT NULL REFERENCES seats,
  price numeric(8,2) NOT NULL CHECK (price > 0), UNIQUE (event_id, seat_id)
);
```

```sql wrong
CREATE TABLE venues (venue_id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE seats (seat_id int PRIMARY KEY, venue_id int NOT NULL REFERENCES venues, label text NOT NULL, UNIQUE (venue_id, label));
CREATE TABLE events (event_id int PRIMARY KEY, venue_id int NOT NULL REFERENCES venues, title text NOT NULL, starts_at timestamptz NOT NULL);
CREATE TABLE tickets (
  ticket_id int PRIMARY KEY, event_id int NOT NULL REFERENCES events, seat_id int NOT NULL UNIQUE REFERENCES seats,
  price numeric(8,2) NOT NULL CHECK (price > 0)
);
```
