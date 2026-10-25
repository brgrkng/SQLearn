---
title: Constraints and integrity
summary: Making bad data impossible. Keys, UNIQUE, CHECK, foreign keys and their ON DELETE actions, deferrable constraints, exclusion constraints and partial unique indexes.
---
Application code changes, gets rewritten, and has bugs. Several services, scripts and people will write to the same database. **Constraints** are rules the database enforces on every write, whoever makes it, so whole categories of bad data simply can't exist.

The rule of thumb for this module: if something must always be true about your data, declare it as a constraint.
