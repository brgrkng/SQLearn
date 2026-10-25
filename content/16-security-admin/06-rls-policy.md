---
title: Tenants see only their own rows
kind: drill
dataset: empty
hints:
  - "`ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;`"
  - "`CREATE POLICY ... ON invoices USING (tenant_id = current_setting('app.tenant_id')::int);`"
---
The setup creates `invoices` and a role `app` with full table privileges. Enable row-level security so that, when running as `app`, a session only sees invoices whose `tenant_id` equals the setting `app.tenant_id`.

```sql setup
CREATE TABLE invoices (invoice_id int PRIMARY KEY, tenant_id int NOT NULL, amount numeric(10,2) NOT NULL);
INSERT INTO invoices VALUES (1, 1, 100), (2, 1, 250), (3, 2, 75), (4, 3, 900);
CREATE ROLE app NOLOGIN;
GRANT SELECT, INSERT, UPDATE, DELETE ON invoices TO app;
```

```sql solution
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoices USING (tenant_id = current_setting('app.tenant_id')::int);
```

```sql check Tenant 1 sees only its invoices
SET ROLE app;
SET app.tenant_id = '1';
SELECT invoice_id FROM invoices;
```

```sql check Tenant 2 can't update tenant 3's invoice
SET ROLE app;
SET app.tenant_id = '2';
UPDATE invoices SET amount = 0 WHERE invoice_id = 4;
RESET ROLE;
SELECT amount FROM invoices WHERE invoice_id = 4;
```

```sql wrong
CREATE POLICY tenant_isolation ON invoices USING (tenant_id = current_setting('app.tenant_id')::int);
```
