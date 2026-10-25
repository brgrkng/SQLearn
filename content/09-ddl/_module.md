---
title: Data types and DDL
summary: Creating and changing tables. CREATE TABLE, choosing the right types, identity columns, defaults, generated columns, enums and ALTER TABLE.
---
So far you've queried tables someone else designed. From here on you build your own. **DDL** (data definition language) is the part of SQL that creates and changes structure: tables, columns, types and schemas.

Most exercises here start from an **empty** database. They're graded by **behaviour**: after your SQL runs, checks insert rows that must succeed or fail, and inspect the table's columns through `information_schema`.
