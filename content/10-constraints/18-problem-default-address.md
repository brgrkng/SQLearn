---
title: Addresses with a default
kind: problem
difficulty: hard
dataset: empty
hints:
  - "A foreign key to `customers` with `ON DELETE CASCADE`, plus a partial unique index for the default."
---
The setup creates `customers`. Create `addresses` with `address_id` (identity primary key), `customer_id` (required, referencing `customers`; deleting a customer deletes their addresses), `line1` (required `text`), `postcode` (required `text`) and `is_default` (required `boolean`, default `false`). Each customer may have **at most one default** address.

```sql setup
CREATE TABLE customers (customer_id int PRIMARY KEY, name text NOT NULL);
INSERT INTO customers VALUES (1, 'Ada'), (2, 'Alan');
```

```sql solution
CREATE TABLE addresses (
  address_id  int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customers ON DELETE CASCADE,
  line1       text NOT NULL,
  postcode    text NOT NULL,
  is_default  boolean NOT NULL DEFAULT false
);
CREATE UNIQUE INDEX one_default_address ON addresses (customer_id) WHERE is_default;
```

```sql check Several addresses, one default each
INSERT INTO addresses (customer_id, line1, postcode, is_default) VALUES
  (1, '1 Main St', 'A1', true), (1, '2 Side St', 'A2', false), (1, '3 Back St', 'A3', false), (2, '9 High St', 'B1', true)
RETURNING address_id;
```

```sql check A second default is rejected
INSERT INTO addresses (customer_id, line1, postcode, is_default) VALUES (1, '4 New St', 'A4', true), (1, '5 Old St', 'A5', true);
```

```sql check Deleting a customer removes their addresses
INSERT INTO addresses (customer_id, line1, postcode) VALUES (2, '8 Low St', 'B2');
DELETE FROM customers WHERE customer_id = 2;
SELECT count(*) FROM addresses WHERE customer_id = 2;
```

```sql wrong
CREATE TABLE addresses (
  address_id  int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customers ON DELETE CASCADE,
  line1       text NOT NULL,
  postcode    text NOT NULL,
  is_default  boolean NOT NULL DEFAULT false
);
```
