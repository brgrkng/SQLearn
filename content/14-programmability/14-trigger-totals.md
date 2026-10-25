---
title: Keep the total in sync
kind: drill
dataset: empty
hints:
  - "On INSERT add `NEW.amount`, on DELETE subtract `OLD.amount`. `TG_OP` tells you which happened."
  - "`AFTER INSERT OR DELETE ON invoice_lines FOR EACH ROW`"
---
`invoices.total` must always equal the sum of its lines' `amount`. Write a trigger on `invoice_lines` that keeps it correct when lines are **inserted or deleted**.

```sql setup
CREATE TABLE invoices (invoice_id int PRIMARY KEY, total numeric(12,2) NOT NULL DEFAULT 0);
CREATE TABLE invoice_lines (line_id int PRIMARY KEY, invoice_id int NOT NULL REFERENCES invoices, amount numeric(10,2) NOT NULL);
INSERT INTO invoices VALUES (1), (2);
```

```sql solution
CREATE FUNCTION sync_total() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE invoices SET total = total + NEW.amount WHERE invoice_id = NEW.invoice_id;
  ELSE
    UPDATE invoices SET total = total - OLD.amount WHERE invoice_id = OLD.invoice_id;
  END IF;
  RETURN NULL;
END
$$;
CREATE TRIGGER invoice_lines_total AFTER INSERT OR DELETE ON invoice_lines FOR EACH ROW EXECUTE FUNCTION sync_total();
```

```sql check Inserts add to the total
INSERT INTO invoice_lines VALUES (1, 1, 10.00), (2, 1, 5.50), (3, 2, 99.99);
SELECT invoice_id, total FROM invoices;
```

```sql check Deletes subtract
DELETE FROM invoice_lines WHERE line_id = 1;
SELECT invoice_id, total FROM invoices;
```

```sql wrong
CREATE FUNCTION sync_total() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE invoices SET total = total + NEW.amount WHERE invoice_id = NEW.invoice_id;
  RETURN NULL;
END
$$;
CREATE TRIGGER invoice_lines_total AFTER INSERT ON invoice_lines FOR EACH ROW EXECUTE FUNCTION sync_total();
```
