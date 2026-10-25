---
title: Sync the warehouse
kind: drill
hints:
  - "`MERGE INTO warehouse w USING feed f ON ...` with three `WHEN` clauses, in the right order."
---
The setup creates `warehouse(product_id, qty)` and a supplier `feed(product_id, qty, discontinued)`. Use **one MERGE** to bring the warehouse in line with the feed:

- feed rows marked `discontinued` delete the matching warehouse row;
- other matching rows get the feed's `qty`;
- feed rows with no warehouse row are inserted, unless they're marked discontinued.

```sql setup
CREATE TABLE warehouse (product_id int PRIMARY KEY, qty int NOT NULL);
INSERT INTO warehouse VALUES (1, 10), (2, 20), (3, 30), (4, 40);
CREATE TABLE feed (product_id int PRIMARY KEY, qty int NOT NULL, discontinued boolean NOT NULL);
INSERT INTO feed VALUES (1, 12, false), (2, 0, true), (5, 50, false), (6, 60, true);
```

```sql solution
MERGE INTO warehouse w
USING feed f ON f.product_id = w.product_id
WHEN MATCHED AND f.discontinued THEN DELETE
WHEN MATCHED THEN UPDATE SET qty = f.qty
WHEN NOT MATCHED AND NOT f.discontinued THEN INSERT (product_id, qty) VALUES (f.product_id, f.qty);
```

```sql check Warehouse contents
SELECT product_id, qty FROM warehouse;
```

```sql wrong
MERGE INTO warehouse w
USING feed f ON f.product_id = w.product_id
WHEN MATCHED THEN UPDATE SET qty = f.qty
WHEN MATCHED AND f.discontinued THEN DELETE
WHEN NOT MATCHED AND NOT f.discontinued THEN INSERT (product_id, qty) VALUES (f.product_id, f.qty);
```

## Explanation
`WHEN` clauses are tried in order and the first match wins. Put the unconditional `WHEN MATCHED THEN UPDATE` first and the `DELETE` branch can never fire, so the discontinued product 2 stays with quantity 0.
