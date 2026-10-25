---
title: Soft delete with a trigger
kind: test
dataset: empty
---
Make `DELETE FROM customers` **not** actually delete. Instead, it should set `deleted_at` to the current time and keep the row. Use a `BEFORE DELETE` row trigger that performs the update and skips the real deletion.

```sql setup
CREATE TABLE customers (customer_id int PRIMARY KEY, name text NOT NULL, deleted_at timestamptz);
INSERT INTO customers VALUES (1, 'Ada', NULL), (2, 'Alan', NULL), (3, 'Grace', NULL);
```

```sql solution
CREATE FUNCTION soft_delete() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE customers SET deleted_at = now() WHERE customer_id = OLD.customer_id;
  RETURN NULL;   -- skip the actual DELETE
END
$$;
CREATE TRIGGER customers_soft_delete BEFORE DELETE ON customers FOR EACH ROW EXECUTE FUNCTION soft_delete();
```

```sql check Deleted rows stay, marked as deleted
DELETE FROM customers WHERE customer_id IN (1, 3);
SELECT customer_id, deleted_at IS NOT NULL FROM customers;
```

```sql wrong
CREATE FUNCTION soft_delete() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE customers SET deleted_at = now() WHERE customer_id = OLD.customer_id;
  RETURN OLD;
END
$$;
CREATE TRIGGER customers_soft_delete BEFORE DELETE ON customers FOR EACH ROW EXECUTE FUNCTION soft_delete();
```
