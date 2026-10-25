---
title: "Part 3a: the busiest stations"
kind: test
dataset: bikeshare
ordered: true
hints:
  - "Count starts and ends separately (or `UNION ALL` the two station columns), then add them."
---
Operations wants the **5 busiest stations** by total activity (trips starting there plus trips ending there). Return the station `name`, departures, arrivals and total. Busiest first, ties broken by name.

```sql solution
WITH movements AS (
  SELECT start_station AS station_id, 1 AS departures, 0 AS arrivals FROM trips
  UNION ALL
  SELECT end_station, 0, 1 FROM trips
)
SELECT s.name, sum(departures) AS departures, sum(arrivals) AS arrivals, count(*) AS total
FROM movements m JOIN stations s ON s.station_id = m.station_id
GROUP BY s.name
ORDER BY total DESC, s.name
LIMIT 5;
```

```sql wrong
SELECT s.name, count(*) AS departures, count(*) AS arrivals, count(*) AS total
FROM trips t JOIN stations s ON s.station_id = t.start_station
GROUP BY s.name
ORDER BY total DESC, s.name
LIMIT 5;
```
