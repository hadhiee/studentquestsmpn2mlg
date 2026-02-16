-- Create a table to store user profiles/game data
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  school text default 'SMPN 2 Malang',
  score int default 0,
  energy int default 3,
  completed_levels int[] default '{}',
  current_node_index int default 0,
  artifacts jsonb default '[]',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policy to allow users to view their own profile
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

-- Policy to allow users to insert their own profile
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Policy to allow users to update their own profile
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Optional: Function to handle new user creation automatically (Trigger)
-- This is useful if you want to create a profile row automatically upon signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
