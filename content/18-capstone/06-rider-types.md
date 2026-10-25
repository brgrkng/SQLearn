---
title: "Part 3c: who rides how"
kind: test
dataset: bikeshare
ordered: true
hints:
  - "Rider type: `coalesce(m.plan, 'casual')` after a LEFT JOIN to members."
---
Compare rider types (`casual`, `annual`, `monthly`) on each bike `model`. Return the rider type, model, number of trips, average trip length in minutes (rounded to 1 decimal) and average fare (rounded to 2 decimals). Sort by rider type, then model.

```sql solution
SELECT coalesce(m.plan, 'casual') AS rider_type, b.model, count(*) AS trips,
       round(avg(extract(epoch FROM t.ended_at - t.started_at) / 60)::numeric, 1) AS avg_minutes,
       round(avg(t.fare), 2) AS avg_fare
FROM trips t
JOIN bikes b ON b.bike_id = t.bike_id
LEFT JOIN members m ON m.member_id = t.member_id
GROUP BY 1, 2
ORDER BY 1, 2;
```

```sql wrong
SELECT m.plan AS rider_type, b.model, count(*) AS trips,
       round(avg(extract(epoch FROM t.ended_at - t.started_at) / 60)::numeric, 1) AS avg_minutes,
       round(avg(t.fare), 2) AS avg_fare
FROM trips t
JOIN bikes b ON b.bike_id = t.bike_id
JOIN members m ON m.member_id = t.member_id
GROUP BY 1, 2
ORDER BY 1, 2;
```
