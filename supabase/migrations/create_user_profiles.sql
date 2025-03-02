create table public.user_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  phone_number text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Create policies
create policy "Users can view their own profile" 
  on public.user_profiles for select 
  using (auth.uid() = user_id);

create policy "Users can update their own profile" 
  on public.user_profiles for update 
  using (auth.uid() = user_id);

create policy "Users can insert their own profile" 
  on public.user_profiles for insert 
  with check (auth.uid() = user_id);

-- Create indexes
create index user_profiles_user_id_idx on public.user_profiles(user_id);

-- Set up triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute procedure public.handle_updated_at(); 