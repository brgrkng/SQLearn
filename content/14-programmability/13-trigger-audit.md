---
title: An audit trail
kind: drill
dataset: empty
hints:
  - "An `AFTER UPDATE ... FOR EACH ROW` trigger that inserts `OLD.price` and `NEW.price` into `price_audit`."
  - "Only log real changes: `IF NEW.price IS DISTINCT FROM OLD.price THEN ...`"
---
Whenever a product's **price changes**, record `product_id`, the old price and the new price in `price_audit`. Updates that don't change the price must not be logged.

```sql setup
CREATE TABLE products (product_id int PRIMARY KEY, name text NOT NULL, price numeric(10,2) NOT NULL);
INSERT INTO products VALUES (1, 'Pen', 2.50), (2, 'Ink', 8.00), (3, 'Pad', 4.00);
CREATE TABLE price_audit (product_id int NOT NULL, old_price numeric(10,2), new_price numeric(10,2));
```

```sql solution
CREATE FUNCTION log_price() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.price IS DISTINCT FROM OLD.price THEN
    INSERT INTO price_audit VALUES (NEW.product_id, OLD.price, NEW.price);
  END IF;
  RETURN NULL;
END
$$;
CREATE TRIGGER products_price_audit AFTER UPDATE ON products FOR EACH ROW EXECUTE FUNCTION log_price();
```

```sql check Price changes are logged, renames aren't
UPDATE products SET price = price * 2 WHERE product_id IN (1, 2);
UPDATE products SET name = 'Notepad' WHERE product_id = 3;
SELECT product_id, old_price, new_price FROM price_audit;
```

```sql wrong
CREATE FUNCTION log_price() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO price_audit VALUES (NEW.product_id, OLD.price, NEW.price);
  RETURN NULL;
END
$$;
CREATE TRIGGER products_price_audit AFTER UPDATE ON products FOR EACH ROW EXECUTE FUNCTION log_price();
```
