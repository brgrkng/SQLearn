---
title: "Part 3d: idle bikes"
kind: test
dataset: bikeshare
ordered: true
hints:
  - "Start from `bikes` so bikes with no trips that week still appear, and put the date condition in the join."
  - "Exclude bikes retired before October: `retired_on IS NULL OR retired_on >= '2025-10-01'`."
---
Maintenance suspects some bikes are broken but never reported. For the **first week of September 2025** (1–7 September), compute each bike's total minutes in use (trips that **started** in that week). Among bikes **not retired before 1 October 2025**, return the **10 least used**: `bike_id`, `model`, number of trips and total minutes (0 for bikes with no trips). Least minutes first, ties broken by `bike_id`.

```sql solution
SELECT b.bike_id, b.model, count(t.trip_id) AS trips,
       coalesce(sum(extract(epoch FROM t.ended_at - t.started_at) / 60), 0) AS minutes
FROM bikes b
LEFT JOIN trips t ON t.bike_id = b.bike_id
                 AND t.started_at >= '2025-09-01' AND t.started_at < '2025-09-08'
WHERE b.retired_on IS NULL OR b.retired_on >= '2025-10-01'
GROUP BY b.bike_id, b.model
ORDER BY minutes, b.bike_id
LIMIT 10;
```

```sql wrong
SELECT b.bike_id, b.model, count(t.trip_id) AS trips,
       coalesce(sum(extract(epoch FROM t.ended_at - t.started_at) / 60), 0) AS minutes
FROM bikes b
LEFT JOIN trips t ON t.bike_id = b.bike_id
WHERE (b.retired_on IS NULL OR b.retired_on >= '2025-10-01')
  AND t.started_at >= '2025-09-01' AND t.started_at < '2025-09-08'
GROUP BY b.bike_id, b.model
ORDER BY minutes, b.bike_id
LIMIT 10;
```
