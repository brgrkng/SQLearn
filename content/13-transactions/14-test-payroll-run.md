---
title: Payroll run
kind: test
dataset: empty
---
In **one transaction**: pay every employee their `salary` into `payouts` (one row each, dated **2026-01-31**), and mark the payroll period **2026-01** as `closed` in `periods`. Then, still inside the same transaction, set a savepoint and **delete** all payouts (a bad cleanup script), roll back to the savepoint, and commit.

```sql setup
CREATE TABLE employees (employee_id int PRIMARY KEY, salary numeric(10,2) NOT NULL);
INSERT INTO employees VALUES (1, 4000), (2, 3500), (3, 5200);
CREATE TABLE payouts (employee_id int REFERENCES employees, paid_on date NOT NULL, amount numeric(10,2) NOT NULL);
CREATE TABLE periods (period text PRIMARY KEY, status text NOT NULL);
INSERT INTO periods VALUES ('2025-12', 'closed'), ('2026-01', 'open');
```

```sql solution
BEGIN;
INSERT INTO payouts SELECT employee_id, '2026-01-31', salary FROM employees;
UPDATE periods SET status = 'closed' WHERE period = '2026-01';
SAVEPOINT paid;
DELETE FROM payouts;
ROLLBACK TO SAVEPOINT paid;
COMMIT;
```

```sql check Payouts
SELECT employee_id, paid_on, amount FROM payouts;
```

```sql check Periods
SELECT period, status FROM periods;
```

```sql wrong
BEGIN;
INSERT INTO payouts SELECT employee_id, '2026-01-31', salary FROM employees;
UPDATE periods SET status = 'closed' WHERE period = '2026-01';
SAVEPOINT paid;
DELETE FROM payouts;
COMMIT;
```
