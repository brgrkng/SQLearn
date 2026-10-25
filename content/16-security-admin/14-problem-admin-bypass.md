---
title: Tenants and an admin
kind: problem
difficulty: hard
dataset: empty
hints:
  - "Policies can target roles: `CREATE POLICY ... TO app_admin USING (true)`."
  - "Permissive policies combine with OR, so give each role its own policy."
---
The setup creates `tickets` and two roles with full privileges: `app` (a tenant's session) and `app_admin` (support staff). Enable RLS so that:

- `app` sees and changes only tickets whose `tenant_id` equals the setting `app.tenant_id`, and can't create tickets for other tenants;
- `app_admin` sees and changes **all** tickets.

```sql setup
CREATE TABLE tickets (ticket_id int PRIMARY KEY, tenant_id int NOT NULL, subject text NOT NULL);
INSERT INTO tickets VALUES (1, 1, 'Login broken'), (2, 2, 'Invoice wrong'), (3, 1, 'Feature request');
CREATE ROLE app NOLOGIN;
CREATE ROLE app_admin NOLOGIN;
GRANT SELECT, INSERT, UPDATE, DELETE ON tickets TO app, app_admin;
```

```sql solution
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_tickets ON tickets TO app
  USING (tenant_id = current_setting('app.tenant_id')::int)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::int);
CREATE POLICY admin_all ON tickets TO app_admin USING (true) WITH CHECK (true);
```

```sql check A tenant sees its tickets
SET ROLE app;
SET app.tenant_id = '1';
SELECT ticket_id FROM tickets;
```

```sql check A tenant can't file for someone else
SET ROLE app;
SET app.tenant_id = '1';
INSERT INTO tickets VALUES (10, 2, 'Sneaky');
```

```sql check The admin sees everything
SET ROLE app_admin;
SELECT count(*) FROM tickets;
```

```sql check The admin can reassign tickets
SET ROLE app_admin;
UPDATE tickets SET tenant_id = 2 WHERE ticket_id = 3 RETURNING tenant_id;
```

```sql wrong
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_tickets ON tickets
  USING (tenant_id = current_setting('app.tenant_id')::int)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::int);
```
