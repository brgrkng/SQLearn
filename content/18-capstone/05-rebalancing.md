---
title: "Part 3b: where the bikes drain away"
kind: test
dataset: bikeshare
ordered: true
hints:
  - "Weekday mornings: `extract(isodow FROM started_at) < 6` and the hour between 7 and 9 (`started_at` in UTC, which is the database time zone)."
  - "Net flow = arrivals − departures. Draining stations have the most negative net flow."
---
Rebalancing vans need to know which stations **lose** bikes during the morning rush. Considering trips that **started on a weekday between 07:00 and 09:59**, compute each station's **net flow** (arrivals − departures of those trips). Return the **5 most draining** stations: `name`, departures, arrivals and net flow. Most negative first, ties broken by name.

```sql solution
WITH rush AS (
  SELECT * FROM trips
  WHERE extract(isodow FROM started_at) < 6 AND extract(hour FROM started_at) BETWEEN 7 AND 9
), flows AS (
  SELECT start_station AS station_id, -1 AS delta, 1 AS dep, 0 AS arr FROM rush
  UNION ALL
  SELECT end_station, 1, 0, 1 FROM rush
)
SELECT s.name, sum(dep) AS departures, sum(arr) AS arrivals, sum(delta) AS net_flow
FROM flows f JOIN stations s ON s.station_id = f.station_id
GROUP BY s.name
ORDER BY net_flow, s.name
LIMIT 5;
```

```sql wrong
WITH rush AS (
  SELECT * FROM trips
  WHERE extract(hour FROM started_at) BETWEEN 7 AND 9
), flows AS (
  SELECT start_station AS station_id, -1 AS delta, 1 AS dep, 0 AS arr FROM rush
  UNION ALL
  SELECT end_station, 1, 0, 1 FROM rush
)
SELECT s.name, sum(dep) AS departures, sum(arr) AS arrivals, sum(delta) AS net_flow
FROM flows f JOIN stations s ON s.station_id = f.station_id
GROUP BY s.name
ORDER BY net_flow, s.name
LIMIT 5;
```
