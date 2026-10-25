---
title: "Part 1: design the schema"
kind: test
dataset: empty
hints:
  - "Members: `plan text NOT NULL CHECK (plan IN ('annual', 'monthly'))` and a unique email."
  - "No double-booked bikes: `EXCLUDE USING gist (bike_id WITH =, tstzrange(started_at, ended_at) WITH &&)`, which needs `btree_gist`."
---
Create the four core tables, enforcing **every rule in the brief** with constraints. Use exactly these names (ids are integers; all columns are required unless the brief says otherwise):

- `stations(station_id, name, capacity)`
- `bikes(bike_id, model)`, where model is `classic` or `electric`
- `members(member_id, email, plan)`
- `trips(trip_id, bike_id, member_id, start_station, end_station, started_at, ended_at, fare)`, with timestamps as `timestamptz`, `member_id` optional, and `fare` as `numeric(8,2)`

```sql solution
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE stations (station_id int PRIMARY KEY, name text NOT NULL UNIQUE, capacity int NOT NULL CHECK (capacity > 0));
CREATE TABLE bikes (bike_id int PRIMARY KEY, model text NOT NULL CHECK (model IN ('classic', 'electric')));
CREATE TABLE members (member_id int PRIMARY KEY, email text NOT NULL UNIQUE, plan text NOT NULL CHECK (plan IN ('annual', 'monthly')));
CREATE TABLE trips (
  trip_id       int PRIMARY KEY,
  bike_id       int NOT NULL REFERENCES bikes,
  member_id     int REFERENCES members,
  start_station int NOT NULL REFERENCES stations,
  end_station   int NOT NULL REFERENCES stations,
  started_at    timestamptz NOT NULL,
  ended_at      timestamptz NOT NULL,
  fare          numeric(8,2) NOT NULL CHECK (fare >= 0),
  CHECK (ended_at > started_at),
  EXCLUDE USING gist (bike_id WITH =, tstzrange(started_at, ended_at) WITH &&)
);
```

```sql check A normal day of trips
INSERT INTO stations VALUES (1, 'Central', 20), (2, 'Harbour', 15);
INSERT INTO bikes VALUES (1, 'classic'), (2, 'electric');
INSERT INTO members VALUES (1, 'a@x.io', 'annual');
INSERT INTO trips VALUES
  (1, 1, 1,    1, 2, '2026-05-01 08:00+00', '2026-05-01 08:20+00', 0),
  (2, 1, NULL, 2, 1, '2026-05-01 08:20+00', '2026-05-01 08:50+00', 8.50),
  (3, 2, NULL, 1, 1, '2026-05-01 08:05+00', '2026-05-01 08:15+00', 3.50);
SELECT count(*) FROM trips;
```

```sql check A bike can't be on two overlapping trips
INSERT INTO stations VALUES (10, 'Museum', 10);
INSERT INTO bikes VALUES (10, 'classic');
INSERT INTO trips VALUES (10, 10, NULL, 10, 10, '2026-05-02 09:00+00', '2026-05-02 09:30+00', 8.50),
                         (11, 10, NULL, 10, 10, '2026-05-02 09:15+00', '2026-05-02 09:45+00', 8.50);
```

```sql check Trips must end after they start
INSERT INTO stations VALUES (20, 'Zoo', 10);
INSERT INTO bikes VALUES (20, 'classic');
INSERT INTO trips VALUES (20, 20, NULL, 20, 20, '2026-05-03 09:00+00', '2026-05-03 08:00+00', 1);
```

```sql check Negative fares are rejected
INSERT INTO stations VALUES (30, 'Pier', 10);
INSERT INTO bikes VALUES (30, 'electric');
INSERT INTO trips VALUES (30, 30, NULL, 30, 30, '2026-05-04 09:00+00', '2026-05-04 09:10+00', -1);
```

```sql check Unknown plans and models are rejected
INSERT INTO members VALUES (40, 'b@x.io', 'weekly');
```

```sql check Stations must exist
INSERT INTO bikes VALUES (50, 'classic');
INSERT INTO trips VALUES (50, 50, NULL, 999, 999, '2026-05-05 09:00+00', '2026-05-05 09:10+00', 1);
```

```sql check Station names and member emails are unique
INSERT INTO stations VALUES (60, 'Same', 5), (61, 'Same', 5);
```

```sql wrong
CREATE TABLE stations (station_id int PRIMARY KEY, name text NOT NULL UNIQUE, capacity int NOT NULL CHECK (capacity > 0));
CREATE TABLE bikes (bike_id int PRIMARY KEY, model text NOT NULL CHECK (model IN ('classic', 'electric')));
CREATE TABLE members (member_id int PRIMARY KEY, email text NOT NULL UNIQUE, plan text NOT NULL CHECK (plan IN ('annual', 'monthly')));
CREATE TABLE trips (
  trip_id int PRIMARY KEY, bike_id int NOT NULL REFERENCES bikes, member_id int REFERENCES members,
  start_station int NOT NULL REFERENCES stations, end_station int NOT NULL REFERENCES stations,
  started_at timestamptz NOT NULL, ended_at timestamptz NOT NULL,
  fare numeric(8,2) NOT NULL CHECK (fare >= 0), CHECK (ended_at > started_at)
);
```
