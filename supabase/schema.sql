-- Run once in the Supabase SQL editor.
create table public.progress (
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  item_id    text not null,
  passed     boolean not null default false,
  sql        text,
  attempts   int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

alter table public.progress enable row level security;

create policy "Learners manage their own progress" on public.progress
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.progress to authenticated;
