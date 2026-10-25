-- Analytics: a subscription web app's users, raw event stream and subscriptions
-- for the first half of 2025. Built for time series, funnels, retention,
-- sessionization and streak problems. Generated deterministically.
SELECT setseed(0.73);

CREATE TABLE users (
  user_id      int PRIMARY KEY,
  signed_up_at timestamp NOT NULL,
  country      text NOT NULL,
  device       text NOT NULL CHECK (device IN ('ios', 'android', 'web')),
  channel      text CHECK (channel IN ('organic', 'ads', 'social', 'referral')),
  referred_by  int REFERENCES users
);

CREATE TABLE events (
  event_id    int PRIMARY KEY,
  user_id     int NOT NULL REFERENCES users,
  event_type  text NOT NULL CHECK (event_type IN ('session_start', 'page_view', 'add_to_cart', 'checkout', 'purchase')),
  occurred_at timestamp NOT NULL,
  page        text,
  amount      numeric(10,2) CHECK ((event_type = 'purchase') = (amount IS NOT NULL))
);

CREATE TABLE subscriptions (
  subscription_id int PRIMARY KEY,
  user_id         int NOT NULL REFERENCES users,
  plan            text NOT NULL CHECK (plan IN ('basic', 'pro', 'team')),
  monthly_price   numeric(8,2) NOT NULL,
  started_on      date NOT NULL,
  ended_on        date CHECK (ended_on > started_on)
);

INSERT INTO users
SELECT u.user_id,
       date_trunc('second', timestamp '2025-01-01' + u.t * interval '180 days'),
       (ARRAY['US','US','US','GB','GB','DE','IN','IN','BR','CA','FR','JP'])[1 + floor(u.c * 12)::int],
       CASE WHEN u.d < 0.40 THEN 'web' WHEN u.d < 0.75 THEN 'ios' ELSE 'android' END,
       CASE WHEN u.m < 0.40 THEN 'organic' WHEN u.m < 0.65 THEN 'ads' WHEN u.m < 0.80 THEN 'social'
            WHEN u.m < 0.92 AND u.user_id > 50 THEN 'referral' END,
       NULL
FROM (
  -- Signup times rise over the half-year; ids follow signup order.
  SELECT row_number() OVER (ORDER BY t) AS user_id, t, c, d, m
  FROM (SELECT sqrt(random()) AS t, random() AS c, random() AS d, random() AS m FROM generate_series(1, 2000)) x
) u;

-- Referred users point at someone who signed up before them.
UPDATE users u SET referred_by = 1 + floor(r.x * (u.user_id - 1))::int
FROM (SELECT user_id, random() AS x FROM users ORDER BY user_id) r
WHERE r.user_id = u.user_id AND u.channel = 'referral';

-- Active days decay after signup (the retention curve); some days have a second session.
CREATE TEMP TABLE _sessions AS
SELECT user_id, start_at, views, cart, checkout, purchase, amount, page_seed
FROM (
  SELECT u.user_id,
         CASE WHEN g.d = 0 AND g.second = 0 THEN u.signed_up_at
              ELSE date_trunc('second', date_trunc('day', u.signed_up_at) + g.d * interval '1 day'
                   + interval '7 hours' + g.second * interval '6 hours' + r.h * interval '5 hours') END AS start_at,
         1 + floor(r.v * 4)::int AS views,
         r.f < 0.30 AS cart, r.f < 0.16 AS checkout, r.f < 0.11 AS purchase,
         round((12 + power(r.a, 2) * 240)::numeric, 2) AS amount,
         r.p AS page_seed,
         r.keep, g.d, g.second, u.signed_up_at
  FROM users u
  CROSS JOIN (SELECT d, second FROM generate_series(0, 75) d, generate_series(0, 1) second) g
  CROSS JOIN LATERAL (
    SELECT random() + 0 * u.user_id + 0 * g.d + 0 * g.second AS keep,
           random() AS h, random() AS v, random() AS f, random() AS a, random() AS p
  ) r
) s
WHERE ((d = 0 AND second = 0)
       OR (second = 0 AND keep < 0.45 * exp(-d / 14.0) + 0.04)
       OR (second = 1 AND keep < (0.45 * exp(-d / 14.0) + 0.04) * 0.25))
  AND start_at < timestamp '2025-07-01'
  AND start_at >= signed_up_at;

INSERT INTO events
SELECT row_number() OVER (ORDER BY occurred_at, user_id, ord), user_id, event_type, occurred_at, page, amount
FROM (
  SELECT user_id, 0 AS ord, 'session_start' AS event_type, start_at AS occurred_at, NULL::text AS page, NULL::numeric AS amount
  FROM _sessions
  UNION ALL
  SELECT s.user_id, v.n, 'page_view', s.start_at + v.n * interval '97 seconds',
         (ARRAY['/home','/pricing','/features','/docs','/blog','/product/a','/product/b','/product/c'])
           [1 + floor(((s.page_seed * 1000 + v.n * 37)::int % 8))::int],
         NULL
  FROM _sessions s CROSS JOIN LATERAL generate_series(1, s.views) AS v(n)
  UNION ALL
  SELECT user_id, 10, 'add_to_cart', start_at + (views + 1) * interval '97 seconds', '/cart', NULL FROM _sessions WHERE cart
  UNION ALL
  SELECT user_id, 11, 'checkout', start_at + (views + 3) * interval '97 seconds', '/checkout', NULL FROM _sessions WHERE checkout
  UNION ALL
  SELECT user_id, 12, 'purchase', start_at + (views + 5) * interval '97 seconds', '/checkout/done', amount FROM _sessions WHERE purchase
) e;

-- About a third of users subscribe; some cancel, and some change plan (one row ends, the next starts).
CREATE TEMP TABLE _subs AS
SELECT user_id, start1, plan1, start1 + len1 AS end1, churn, switch
FROM (
  SELECT u.user_id, u.signed_up_at::date + floor(x.s * 20)::int AS start1,
         CASE WHEN x.p < 0.55 THEN 'basic' WHEN x.p < 0.90 THEN 'pro' ELSE 'team' END AS plan1,
         30 + floor(x.l * 100)::int AS len1, x.k, x.churn, x.switch
  FROM users u
  JOIN (SELECT user_id, random() AS k, random() AS s, random() AS p, random() AS l, random() AS churn, random() AS switch
        FROM users ORDER BY user_id) x USING (user_id)
) a
WHERE k < 0.33 AND start1 < date '2025-06-25';

INSERT INTO subscriptions
SELECT row_number() OVER (ORDER BY started_on, user_id, seq), user_id, plan,
       CASE plan WHEN 'basic' THEN 9.99 WHEN 'pro' THEN 29.99 ELSE 99.00 END,
       started_on,
       CASE WHEN ended_on < date '2025-07-01' THEN ended_on END
FROM (
  SELECT user_id, 1 AS seq, plan1 AS plan, start1 AS started_on,
         CASE WHEN churn < 0.35 OR switch < 0.12 THEN end1 END AS ended_on
  FROM _subs
  UNION ALL
  SELECT user_id, 2, CASE plan1 WHEN 'basic' THEN 'pro' WHEN 'pro' THEN 'team' ELSE 'pro' END, end1, NULL
  FROM _subs
  WHERE churn >= 0.35 AND switch < 0.12 AND end1 < date '2025-06-30'
) s;

DROP TABLE _sessions, _subs;
