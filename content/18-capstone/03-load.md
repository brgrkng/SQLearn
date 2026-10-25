---
title: "Part 2: load the export"
kind: test
dataset: empty
hints:
  - "Join `trips_raw` to `stations` on name, twice: once for the start, once for the end."
  - "Unknown station names make the inner joins drop the row. That's what's asked."
  - "`NULLIF(member_email, '')` turns empty strings into NULL. Then LEFT JOIN members on email."
  - "Text to timestamp: `started::timestamptz`. Fare text: `fare::numeric`."
---
The old system exported trips as text, with station **names** and member **emails** instead of ids. The setup creates the reference tables (stations, bikes, members, empty trips) and the raw export `trips_raw`. Load every raw row into `trips`:

- convert `started` / `ended` to timestamps and `fare` to a number;
- look up `start_station` / `end_station` ids by station name;
- look up `member_id` by email (an empty email means a casual trip, so `member_id` is NULL);
- **skip** rows whose start or end station name doesn't exist.

Use `raw_id` as the `trip_id`.

```sql setup
CREATE TABLE stations (station_id int PRIMARY KEY, name text NOT NULL UNIQUE, capacity int NOT NULL);
CREATE TABLE bikes (bike_id int PRIMARY KEY, model text NOT NULL);
CREATE TABLE members (member_id int PRIMARY KEY, email text NOT NULL UNIQUE, plan text NOT NULL);
CREATE TABLE trips (trip_id int PRIMARY KEY, bike_id int NOT NULL REFERENCES bikes, member_id int REFERENCES members,
                    start_station int NOT NULL REFERENCES stations, end_station int NOT NULL REFERENCES stations,
                    started_at timestamptz NOT NULL, ended_at timestamptz NOT NULL, fare numeric(8,2) NOT NULL);
INSERT INTO stations VALUES (1, 'Central Station', 20), (2, 'Harbour Front', 15), (3, 'Old Town', 12);
INSERT INTO bikes VALUES (1, 'classic'), (2, 'electric'), (3, 'classic');
INSERT INTO members VALUES (1, 'ada@mail.example', 'annual'), (2, 'alan@mail.example', 'monthly');
CREATE TABLE trips_raw (raw_id int, bike text, member_email text, from_station text, to_station text, started text, ended text, fare text);
INSERT INTO trips_raw VALUES
  (101, '1', 'ada@mail.example',  'Central Station', 'Harbour Front', '2025-05-01 08:02:00+00', '2025-05-01 08:19:00+00', '0.00'),
  (102, '2', '',                  'Harbour Front',   'Old Town',      '2025-05-01 08:10:00+00', '2025-05-01 08:31:00+00', '6.25'),
  (103, '3', 'alan@mail.example', 'Old Town',        'Old Town',      '2025-05-01 09:00:00+00', '2025-05-01 09:45:00+00', '2.25'),
  (104, '1', '',                  'Central Station', 'Moon Base',     '2025-05-01 10:00:00+00', '2025-05-01 10:30:00+00', '8.50'),
  (105, '2', 'ada@mail.example',  'Old Town',        'Central Station','2025-05-02 17:40:00+00', '2025-05-02 18:05:00+00', '0.00');
```

```sql solution
INSERT INTO trips (trip_id, bike_id, member_id, start_station, end_station, started_at, ended_at, fare)
SELECT r.raw_id, r.bike::int, m.member_id, s1.station_id, s2.station_id,
       r.started::timestamptz, r.ended::timestamptz, r.fare::numeric
FROM trips_raw r
JOIN stations s1 ON s1.name = r.from_station
JOIN stations s2 ON s2.name = r.to_station
LEFT JOIN members m ON m.email = nullif(r.member_email, '');
```

```sql check Loaded trips
SELECT trip_id, bike_id, member_id, start_station, end_station, started_at, ended_at, fare FROM trips;
```

```sql wrong
INSERT INTO trips (trip_id, bike_id, member_id, start_station, end_station, started_at, ended_at, fare)
SELECT r.raw_id, r.bike::int, m.member_id, s1.station_id, s1.station_id,
       r.started::timestamptz, r.ended::timestamptz, r.fare::numeric
FROM trips_raw r
JOIN stations s1 ON s1.name = r.from_station
LEFT JOIN members m ON m.email = r.member_email;
```
