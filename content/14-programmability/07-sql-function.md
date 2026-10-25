---
title: A display-name function
kind: drill
dataset: empty
hints:
  - "`CREATE FUNCTION display_name(first text, last text) RETURNS text LANGUAGE sql IMMUTABLE RETURN ...;`"
  - "`left(first, 1)` gives the initial."
---
Create an `IMMUTABLE` SQL function `display_name(first text, last text)` that returns names like `A. Lovelace` (first initial, a full stop, a space, the last name).

```sql solution
CREATE FUNCTION display_name(first text, last text) RETURNS text
LANGUAGE sql IMMUTABLE
RETURN left(first, 1) || '. ' || last;
```

```sql check It formats names
SELECT display_name('Ada', 'Lovelace'), display_name('Grace', 'Hopper');
```

```sql check It's declared immutable
SELECT provolatile FROM pg_proc WHERE proname = 'display_name';
```

```sql wrong
CREATE FUNCTION display_name(first text, last text) RETURNS text
LANGUAGE sql
RETURN left(first, 1) || '. ' || last;
```
