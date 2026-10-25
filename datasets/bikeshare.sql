-- Bikeshare: the capstone's city bike-share scheme. 40 stations, 600 bikes,
-- 3,000 members and about 60k trips from April to September 2025.
SELECT setseed(0.29);

CREATE TABLE stations (
  station_id int PRIMARY KEY,
  name       text NOT NULL UNIQUE,
  capacity   int NOT NULL CHECK (capacity > 0),
  opened_on  date NOT NULL
);

CREATE TABLE bikes (
  bike_id         int PRIMARY KEY,
  model           text NOT NULL CHECK (model IN ('classic', 'electric')),
  commissioned_on date NOT NULL,
  retired_on      date CHECK (retired_on > commissioned_on)
);

CREATE TABLE members (
  member_id int PRIMARY KEY,
  email     text NOT NULL UNIQUE,
  plan      text NOT NULL CHECK (plan IN ('annual', 'monthly')),
  joined_on date NOT NULL
);

CREATE TABLE trips (
  trip_id       int PRIMARY KEY,
  bike_id       int NOT NULL REFERENCES bikes,
  member_id     int REFERENCES members,          -- NULL for casual riders
  start_station int NOT NULL REFERENCES stations,
  end_station   int NOT NULL REFERENCES stations,
  started_at    timestamptz NOT NULL,
  ended_at      timestamptz NOT NULL,
  fare          numeric(8,2) NOT NULL CHECK (fare >= 0),
  CHECK (ended_at > started_at)
);

CREATE TABLE maintenance (
  maintenance_id int PRIMARY KEY,
  bike_id        int NOT NULL REFERENCES bikes,
  done_on        date NOT NULL,
  issue          text NOT NULL
);

INSERT INTO stations
SELECT i, n.names[i], 15 + (i * 7) % 26, date '2019-03-01' + (i * 53) % 1500
FROM generate_series(1, 40) AS i,
     (SELECT ARRAY['Central Station','Harbour Front','Market Square','City Hall','University','Museum Quarter',
       'Riverside','Old Town','Tech Park','Stadium','Botanic Garden','North Gate','South Pier','East Market',
       'West End','Library','Hospital','Cathedral','Canal Street','Mill Lane','Station Road','Park Avenue',
       'Queens Bridge','Kings Road','Lighthouse','Fish Market','Opera House','Science Centre','Zoo','Airport Link',
       'Bus Terminal','Ferry Dock','High Street','Castle Hill','Arts Centre','Velodrome','Lakeside','Hilltop',
       'Brewery','Foundry Yard']) n(names);

INSERT INTO bikes
SELECT i, CASE WHEN r.a < 0.3 THEN 'electric' ELSE 'classic' END,
       date '2021-01-01' + floor(r.b * 1400)::int,
       CASE WHEN r.c < 0.06 THEN date '2025-10-15' + floor(r.d * 60)::int END
FROM generate_series(1, 600) AS i
CROSS JOIN LATERAL (SELECT random() + 0 * i AS a, random() AS b, random() AS c, random() AS d) r;

INSERT INTO members
SELECT i, 'rider' || i || '@mail.example', CASE WHEN r.a < 0.55 THEN 'annual' ELSE 'monthly' END,
       date '2023-01-01' + floor(r.b * 900)::int
FROM generate_series(1, 3000) AS i
CROSS JOIN LATERAL (SELECT random() + 0 * i AS a, random() AS b) r;

-- Trips: popular stations (low ids) get more starts; commuter peaks at 08:00 and 17:30.
INSERT INTO trips
SELECT row_number() OVER (ORDER BY t.started_at, t.k),
       t.bike_id, t.member_id, t.start_station, t.end_station, t.started_at,
       t.started_at + t.minutes * interval '1 minute',
       CASE WHEN t.member_id IS NULL THEN round(1.00 + 0.25 * t.minutes, 2)
            WHEN t.plan = 'annual' THEN round(greatest(t.minutes - 45, 0) * 0.15, 2)
            ELSE round(greatest(t.minutes - 30, 0) * 0.15, 2) END
FROM (
  SELECT x.k,
         1 + floor(x.b * 600)::int AS bike_id,
         CASE WHEN x.c < 0.25 THEN NULL ELSE 1 + floor(power(x.d, 1.6) * 3000)::int END AS member_id,
         1 + floor(power(x.e, 1.8) * 40)::int AS start_station,
         CASE WHEN x.f < 0.07 THEN 1 + floor(power(x.e, 1.8) * 40)::int ELSE 1 + floor(power(x.g, 1.3) * 40)::int END AS end_station,
         date_trunc('minute', timestamptz '2025-04-01 00:00+00' + floor(x.h * 183) * interval '1 day'
           + CASE WHEN x.i < 0.35 THEN interval '7 hours 30 minutes' + x.j * interval '90 minutes'
                  WHEN x.i < 0.65 THEN interval '16 hours 45 minutes' + x.j * interval '120 minutes'
                  ELSE interval '6 hours' + x.j * interval '16 hours' END) AS started_at,
         3 + floor(power(x.l, 2) * 55)::int AS minutes,
         m.plan
  FROM (
    SELECT k, random() AS b, random() AS c, random() AS d, random() AS e, random() AS f, random() AS g,
           random() AS h, random() AS i, random() AS j, random() AS l
    FROM generate_series(1, 60000) AS k
    ORDER BY k
  ) x
  LEFT JOIN members m ON m.member_id = CASE WHEN x.c < 0.25 THEN NULL ELSE 1 + floor(power(x.d, 1.6) * 3000)::int END
) t;

INSERT INTO maintenance
SELECT i, 1 + floor(r.a * 600)::int, date '2025-04-01' + floor(r.b * 183)::int,
       (ARRAY['flat tyre','brakes','chain','battery','lights','gears'])[1 + floor(r.c * 6)::int]
FROM generate_series(1, 1500) AS i
CROSS JOIN LATERAL (SELECT random() + 0 * i AS a, random() AS b, random() AS c) r;
