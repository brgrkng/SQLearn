---
title: Users and profiles
kind: drill
dataset: empty
hints:
  - "Make `user_profiles.user_id` both the primary key and a foreign key to `users`."
---
Design `users(user_id, email)` and `user_profiles(user_id, bio)`. Emails are required and unique. A user has **at most one** profile, a profile belongs to exactly one existing user, and deleting a user deletes their profile.

```sql solution
CREATE TABLE users (user_id int PRIMARY KEY, email text NOT NULL UNIQUE);
CREATE TABLE user_profiles (user_id int PRIMARY KEY REFERENCES users ON DELETE CASCADE, bio text);
```

```sql check One profile per user
INSERT INTO users VALUES (1, 'ada@x.io'), (2, 'alan@x.io');
INSERT INTO user_profiles VALUES (1, 'Analyst'), (1, 'Second profile');
```

```sql check Profiles need a real user
INSERT INTO user_profiles VALUES (99, 'Nobody');
```

```sql check Deleting a user removes the profile
INSERT INTO users VALUES (3, 'grace@x.io');
INSERT INTO user_profiles VALUES (3, 'Admiral');
DELETE FROM users WHERE user_id = 3;
SELECT count(*) FROM user_profiles;
```

```sql check Emails are unique
INSERT INTO users VALUES (4, 'same@x.io'), (5, 'same@x.io');
```

```sql wrong
CREATE TABLE users (user_id int PRIMARY KEY, email text NOT NULL UNIQUE);
CREATE TABLE user_profiles (profile_id serial PRIMARY KEY, user_id int REFERENCES users ON DELETE CASCADE, bio text);
```
