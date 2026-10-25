---
title: Newsletter sign-ups
kind: drill
hints:
  - "`INSERT INTO newsletter (email) SELECT email FROM customers WHERE ... ON CONFLICT DO NOTHING`"
  - Customers without an email can't subscribe.
---
The setup creates a `newsletter(email, joined_on)` table that already contains some addresses. Subscribe every customer in **Kenya** who has an email, with `joined_on` = **2026-02-01**. Existing subscribers must keep their original `joined_on` date.

```sql setup
CREATE TABLE newsletter (email text PRIMARY KEY, joined_on date NOT NULL);
INSERT INTO newsletter
SELECT email, '2025-06-01' FROM customers WHERE country = 'Kenya' AND email IS NOT NULL AND customer_id % 3 = 0;
```

```sql solution
INSERT INTO newsletter (email, joined_on)
SELECT email, '2026-02-01' FROM customers WHERE country = 'Kenya' AND email IS NOT NULL
ON CONFLICT (email) DO NOTHING;
```

```sql check Subscribers and their dates
SELECT joined_on, count(*) FROM newsletter GROUP BY joined_on;
```

```sql wrong
INSERT INTO newsletter (email, joined_on)
SELECT email, '2026-02-01' FROM customers WHERE country = 'Kenya' AND email IS NOT NULL
ON CONFLICT (email) DO UPDATE SET joined_on = EXCLUDED.joined_on;
```
