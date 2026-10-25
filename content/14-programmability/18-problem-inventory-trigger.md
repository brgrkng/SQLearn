---
title: Refuse to oversell
kind: problem
difficulty: hard
dataset: empty
hints:
  - "A `BEFORE INSERT` trigger on `order_lines` that decrements stock with `UPDATE ... WHERE on_hand >= NEW.qty`."
  - "`IF NOT FOUND THEN RAISE EXCEPTION ...` makes the whole INSERT fail."
---
When an order line is **inserted**, the product's `stock.on_hand` must go down by the line's `qty`. If there isn't enough stock, the insert must **fail** with an exception, leaving stock unchanged. Implement it with a trigger.

```sql setup
CREATE TABLE stock (sku text PRIMARY KEY, on_hand int NOT NULL CHECK (on_hand >= 0));
INSERT INTO stock VALUES ('PEN', 10), ('INK', 2);
CREATE TABLE order_lines (order_id int, sku text REFERENCES stock, qty int NOT NULL CHECK (qty > 0), PRIMARY KEY (order_id, sku));
```

```sql solution
CREATE FUNCTION take_stock() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE stock SET on_hand = on_hand - NEW.qty WHERE sku = NEW.sku AND on_hand >= NEW.qty;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Not enough % in stock', NEW.sku;
  END IF;
  RETURN NEW;
END
$$;
CREATE TRIGGER order_lines_take_stock BEFORE INSERT ON order_lines FOR EACH ROW EXECUTE FUNCTION take_stock();
```

```sql check Normal orders reduce stock
INSERT INTO order_lines VALUES (1, 'PEN', 3), (1, 'INK', 1);
SELECT sku, on_hand FROM stock;
```

```sql check Overselling is refused
INSERT INTO order_lines VALUES (2, 'INK', 5);
```

```sql check Stock is unchanged by the refused order
SELECT sku, on_hand FROM stock;
```

```sql wrong
CREATE FUNCTION take_stock() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE stock SET on_hand = on_hand - NEW.qty WHERE sku = NEW.sku;
  RETURN NEW;
END
$$;
CREATE TRIGGER order_lines_take_stock AFTER INSERT ON order_lines FOR EACH ROW EXECUTE FUNCTION take_stock();
```

## Explanation
The wrong version relies on the `CHECK (on_hand >= 0)` constraint to stop overselling. It does refuse the insert, but with a check violation (`23514`) instead of a clear business error. The exercise compares error codes, so the trigger has to raise its own exception. In real systems, a meaningful error message is the difference between a support ticket and a self-explanatory screen.
