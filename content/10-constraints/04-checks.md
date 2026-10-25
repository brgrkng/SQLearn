---
title: Promotions with rules
kind: drill
dataset: empty
hints:
  - "Three `CHECK` constraints: `discount_pct BETWEEN 1 AND 90`, `ends_on > starts_on`, and `min_spend >= 0`."
---
Create `promotions` with `promo_id` (`int`, primary key), `discount_pct` (required `int`, from **1 to 90** inclusive), `min_spend` (required `numeric(8,2)`, **not negative**), `starts_on` and `ends_on` (required `date`s, with the end **strictly after** the start).

```sql solution
CREATE TABLE promotions (
  promo_id     int PRIMARY KEY,
  discount_pct int NOT NULL CHECK (discount_pct BETWEEN 1 AND 90),
  min_spend    numeric(8,2) NOT NULL CHECK (min_spend >= 0),
  starts_on    date NOT NULL,
  ends_on      date NOT NULL,
  CHECK (ends_on > starts_on)
);
```

```sql check Valid promotions are accepted
INSERT INTO promotions VALUES (1, 1, 0, '2026-01-01', '2026-01-02'), (2, 90, 50, '2026-02-01', '2026-03-01') RETURNING promo_id;
```

```sql check A 95% discount is rejected
INSERT INTO promotions VALUES (3, 95, 0, '2026-01-01', '2026-02-01');
```

```sql check A 0% discount is rejected
INSERT INTO promotions VALUES (4, 0, 0, '2026-01-01', '2026-02-01');
```

```sql check A negative minimum spend is rejected
INSERT INTO promotions VALUES (5, 10, -1, '2026-01-01', '2026-02-01');
```

```sql check Ending on the start day is rejected
INSERT INTO promotions VALUES (6, 10, 0, '2026-01-01', '2026-01-01');
```

```sql wrong
CREATE TABLE promotions (
  promo_id     int PRIMARY KEY,
  discount_pct int NOT NULL CHECK (discount_pct BETWEEN 0 AND 90),
  min_spend    numeric(8,2) NOT NULL CHECK (min_spend >= 0),
  starts_on    date NOT NULL,
  ends_on      date NOT NULL,
  CHECK (ends_on >= starts_on)
);
```
