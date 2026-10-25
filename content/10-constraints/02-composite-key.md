---
title: Who's on which team
kind: drill
dataset: empty
hints:
  - "`PRIMARY KEY (team_id, player_id)` at the end of the column list."
---
Create `memberships` linking players to teams: `team_id` (`int`), `player_id` (`int`) and `joined_on` (required `date`). A player can be on many teams, and a team has many players, but the **same player can't join the same team twice**.

```sql solution
CREATE TABLE memberships (
  team_id   int,
  player_id int,
  joined_on date NOT NULL,
  PRIMARY KEY (team_id, player_id)
);
```

```sql check A player on two teams, a team with two players
INSERT INTO memberships VALUES (1, 10, '2026-01-01'), (2, 10, '2026-01-02'), (1, 11, '2026-01-03') RETURNING team_id;
```

```sql check The same pair twice is rejected
INSERT INTO memberships VALUES (1, 10, '2026-01-01'), (1, 10, '2026-02-01');
```

```sql check Neither id may be NULL
INSERT INTO memberships VALUES (NULL, 10, '2026-01-01');
```

```sql wrong
CREATE TABLE memberships (team_id int PRIMARY KEY, player_id int, joined_on date NOT NULL);
```

```sql wrong
CREATE TABLE memberships (team_id int, player_id int, joined_on date NOT NULL, UNIQUE (team_id, player_id));
```
