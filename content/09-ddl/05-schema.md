---
title: A reporting schema
kind: drill
dataset: empty
hints:
  - "`CREATE SCHEMA reporting;` then `CREATE TABLE reporting.daily_sales (...)`"
---
Create a schema named `reporting`, and inside it a table `daily_sales` with `day` (`date`, primary key) and `revenue` (`numeric(12,2)`, required).

```sql solution
CREATE SCHEMA reporting;
CREATE TABLE reporting.daily_sales (day date PRIMARY KEY, revenue numeric(12,2) NOT NULL);
```

```sql check The table lives in the reporting schema
SELECT table_schema, column_name, data_type FROM information_schema.columns WHERE table_name = 'daily_sales';
```

```sql check It accepts a row
INSERT INTO reporting.daily_sales VALUES ('2026-01-01', 1234.50) RETURNING revenue;
```

```sql wrong
CREATE TABLE daily_sales (day date PRIMARY KEY, revenue numeric(12,2) NOT NULL);
```
