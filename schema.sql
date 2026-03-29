-- Supabase Schema for Shop Management

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: customers
create table customers (
    id uuid default uuid_generate_v4() primary key,
    owner_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    total_khata_balance decimal(10,2) default 0.00 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: active_tabs
create table active_tabs (
    id uuid default uuid_generate_v4() primary key,
    customer_id uuid references customers(id) on delete cascade not null,
    current_total decimal(10,2) default 0.00 not null,
    status text default 'open' check (status in ('open', 'closed', 'transferred_to_khata')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: tab_items
create table tab_items (
    id uuid default uuid_generate_v4() primary key,
    tab_id uuid references active_tabs(id) on delete cascade not null,
    item_name text not null,
    price decimal(10,2) not null,
    quantity integer default 1 not null,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: khata_transactions
create table khata_transactions (
    id uuid default uuid_generate_v4() primary key,
    customer_id uuid references customers(id) on delete cascade not null,
    amount decimal(10,2) not null,
    type text check (type in ('credit', 'payment')) not null,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: quick_add_items
create table quick_add_items (
    id uuid default uuid_generate_v4() primary key,
    owner_id uuid references auth.users(id) on delete cascade not null,
    item_name text not null,
    price decimal(10,2) not null
);

-- Row Level Security (RLS)
alter table customers enable row level security;
alter table active_tabs enable row level security;
alter table tab_items enable row level security;
alter table khata_transactions enable row level security;
alter table quick_add_items enable row level security;

-- Policies for Owner isolation
create policy "Owners manage their customers"
    on customers for all using (auth.uid() = owner_id);

create policy "Owners manage their tabs"
    on active_tabs for all using (
        exists (
            select 1 from customers 
            where customers.id = active_tabs.customer_id 
            and customers.owner_id = auth.uid()
        )
    );

create policy "Owners manage tab items"
    on tab_items for all using (
        exists (
            select 1 from active_tabs
            join customers on customers.id = active_tabs.customer_id
            where active_tabs.id = tab_items.tab_id
            and customers.owner_id = auth.uid()
        )
    );

create policy "Owners manage khata"
    on khata_transactions for all using (
        exists (
            select 1 from customers 
            where customers.id = khata_transactions.customer_id 
            and customers.owner_id = auth.uid()
        )
    );

create policy "Owners manage quick items"
    on quick_add_items for all using (auth.uid() = owner_id);

-- Insert Default Quick Items (Optional initial trigger or just manually inserted in UI)
