---
title: No writing into other tenants
kind: drill
dataset: empty
hints:
  - "`USING` only filters what you can see. `WITH CHECK` validates rows you write."
---
RLS is already enabled with a policy that filters reads by `app.tenant_id`, but a tenant can still **insert** rows for another tenant. Replace the policy (drop it and create a new one) so that inserts and updates are also restricted to the session's own tenant.

```sql setup
CREATE TABLE invoices (invoice_id int PRIMARY KEY, tenant_id int NOT NULL, amount numeric(10,2) NOT NULL);
INSERT INTO invoices VALUES (1, 1, 100), (2, 2, 75);
CREATE ROLE app NOLOGIN;
GRANT SELECT, INSERT, UPDATE, DELETE ON invoices TO app;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoices USING (tenant_id = current_setting('app.tenant_id')::int) WITH CHECK (true);
```

```sql solution
DROP POLICY tenant_isolation ON invoices;
CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.tenant_id')::int)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::int);
```

```sql check Own-tenant inserts work
SET ROLE app;
SET app.tenant_id = '1';
INSERT INTO invoices VALUES (10, 1, 5) RETURNING invoice_id;
```

```sql check Inserting for another tenant is refused
SET ROLE app;
SET app.tenant_id = '1';
INSERT INTO invoices VALUES (11, 2, 5);
```

```sql check Moving an invoice to another tenant is refused
SET ROLE app;
SET app.tenant_id = '1';
UPDATE invoices SET tenant_id = 2 WHERE invoice_id = 1;
```

```sql wrong
DROP POLICY tenant_isolation ON invoices;
CREATE POLICY tenant_isolation ON invoices USING (tenant_id = current_setting('app.tenant_id')::int);
CREATE POLICY anyone_inserts ON invoices FOR INSERT WITH CHECK (true);
```
