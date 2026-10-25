---
title: Delete an invoice, delete its lines
kind: drill
dataset: empty
hints:
  - "`REFERENCES invoices ON DELETE CASCADE`"
---
The setup creates `invoices`. Create `invoice_lines` with `invoice_id` (required, referencing `invoices`), `line_no` (`int`) and `amount` (required `numeric(10,2)`), primary key (`invoice_id`, `line_no`). **Deleting an invoice must delete its lines.**

```sql setup
CREATE TABLE invoices (invoice_id int PRIMARY KEY, issued_on date NOT NULL);
INSERT INTO invoices VALUES (1, '2026-01-05'), (2, '2026-01-06');
```

```sql solution
CREATE TABLE invoice_lines (
  invoice_id int NOT NULL REFERENCES invoices ON DELETE CASCADE,
  line_no    int,
  amount     numeric(10,2) NOT NULL,
  PRIMARY KEY (invoice_id, line_no)
);
```

```sql check Deleting an invoice removes its lines only
INSERT INTO invoice_lines VALUES (1, 1, 10), (1, 2, 20), (2, 1, 30);
DELETE FROM invoices WHERE invoice_id = 1;
SELECT invoice_id, line_no FROM invoice_lines;
```

```sql check Lines for missing invoices are rejected
INSERT INTO invoice_lines VALUES (42, 1, 5);
```

```sql wrong
CREATE TABLE invoice_lines (
  invoice_id int NOT NULL REFERENCES invoices,
  line_no    int,
  amount     numeric(10,2) NOT NULL,
  PRIMARY KEY (invoice_id, line_no)
);
```
