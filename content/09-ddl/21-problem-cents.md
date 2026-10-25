---
title: Cents to dollars
kind: problem
difficulty: hard
dataset: empty
hints:
  - "One `ALTER COLUMN ... TYPE numeric(10,2) USING amount_cents / 100.0`, plus a rename."
  - "Integer division would lose the cents: divide by `100.0`."
---
`payments.amount_cents` stores whole cents as an integer. Convert it in place to a column named `amount` of type `numeric(10,2)` holding **dollars** (e.g. `1999` becomes `19.99`).

```sql setup
CREATE TABLE payments (payment_id int PRIMARY KEY, amount_cents int NOT NULL);
INSERT INTO payments VALUES (1, 1999), (2, 50), (3, 123456), (4, 7);
```

```sql solution
ALTER TABLE payments ALTER COLUMN amount_cents TYPE numeric(10,2) USING amount_cents / 100.0;
ALTER TABLE payments RENAME COLUMN amount_cents TO amount;
```

```sql check Amounts in dollars
SELECT payment_id, amount FROM payments;
```

```sql check Column type
SELECT column_name, data_type, numeric_scale, is_nullable FROM information_schema.columns WHERE table_name = 'payments';
```

```sql wrong
ALTER TABLE payments ALTER COLUMN amount_cents TYPE numeric(10,2) USING amount_cents / 100;
ALTER TABLE payments RENAME COLUMN amount_cents TO amount;
```
