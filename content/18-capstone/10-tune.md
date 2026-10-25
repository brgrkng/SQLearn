---
title: "Part 4: tune the bike history"
kind: test
dataset: bikeshare
costSlack: 10
hints:
  - "The query filters on `bike_id` and sorts by `started_at`. One composite index serves both."
---
The maintenance dashboard shows a bike's 20 most recent trips, and it's slow because `trips` has no index on `bike_id`. Create **one** index that makes this query cheap:

```sql norun
SELECT trip_id, started_at, ended_at, start_station, end_station
FROM trips WHERE bike_id = 123
ORDER BY started_at DESC
LIMIT 20;
```

```sql solution
CREATE INDEX trips_bike_started_idx ON trips (bike_id, started_at);
```

```sql explain
SELECT trip_id, started_at, ended_at, start_station, end_station
FROM trips WHERE bike_id = 123
ORDER BY started_at DESC
LIMIT 20;
```

```sql wrong
CREATE INDEX trips_started_idx ON trips (started_at);
```

```sql wrong
CREATE INDEX trips_started_bike_idx ON trips (started_at, bike_id);
```
