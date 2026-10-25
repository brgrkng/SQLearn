---
title: Views, functions and triggers
summary: Reusable queries with views and materialized views, SQL and PL/pgSQL functions, procedures, and triggers for audit logs, timestamps and derived data.
---
So far everything has been a single statement. PostgreSQL can also store **logic** in the database: named queries (views), reusable computations (functions), and code that runs automatically when data changes (triggers).

Used well, they give every application the same definitions and the same rules. Used carelessly, they hide behaviour where nobody looks. This module covers both sides.
