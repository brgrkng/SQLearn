---
title: The brief
kind: lesson
dataset: bikeshare
---
> **CityCycle** runs a docked bike-share scheme. Riders unlock a bike at a **station**, ride, and dock it at any station. Some riders are **members** on an annual or monthly plan. Others ride as **casual** users without an account. Bikes are either **classic** or **electric**. They're commissioned, sometimes retired, and regularly **maintained**.
>
> Rules the business cares about:
> - Every station has a unique name and a capacity of at least one dock.
> - Every member has a unique email and is on exactly one plan: annual or monthly.
> - A trip uses one bike, starts and ends at real stations, and ends after it starts. Fares are never negative.
> - **A bike can't be on two trips at the same time.**
> - Casual trips have no member. Member trips must reference a real member.

## The reference schema

This is the design the rest of the capstone uses (you'll build your own version in the first exercise):

```sql
SELECT table_name, string_agg(column_name || ' ' || data_type, ', ' ORDER BY ordinal_position) AS columns
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY table_name
ORDER BY table_name;
```

A taste of the data:

```sql
SELECT t.trip_id, b.model, s1.name AS from_station, s2.name AS to_station,
       t.started_at, t.ended_at - t.started_at AS duration, t.fare, m.plan
FROM trips t
JOIN bikes b ON b.bike_id = t.bike_id
JOIN stations s1 ON s1.station_id = t.start_station
JOIN stations s2 ON s2.station_id = t.end_station
LEFT JOIN members m ON m.member_id = t.member_id
ORDER BY t.trip_id
LIMIT 5;
```

Fares follow the pricing rules: casual riders pay $1.00 plus $0.25 a minute. Annual members ride free for 45 minutes, monthly members for 30, and both pay $0.15 a minute after that.

## The plan

1. **Design** the schema with every rule above enforced by the database.
2. **Load** a messy CSV-style export into a normalized schema.
3. **Answer** the operations team's questions: busy stations, rebalancing, member behaviour, revenue.
4. **Tune** the slow bike-history query behind the maintenance dashboard.
5. **Report**: build a view the finance team can query.

Each exercise is self-contained. The query exercises always start from the reference data, whatever you designed earlier.
