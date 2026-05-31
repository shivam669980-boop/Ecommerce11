-- Zoko Luxury Mall - Complete Supabase Database Schema
-- Production Ready, Robust, and Optimized

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ====================================================
-- 1. PROFILES & USERS
-- ====================================================

create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text not null unique,
    full_name text,
    avatar_url text,
    role text not null default 'customer' check (role in ('customer', 'vendor', 'admin')),
    phone text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- 2. CATEGORIES & BRANDS
-- ====================================================

create table public.categories (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    description text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.brands (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    logo_url text,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- 3. PRODUCTS & INVENTORY
-- ====================================================

create table public.products (
    id uuid default gen_random_uuid() primary key,
    category_id uuid references public.categories(id) on delete set null,
    brand_id uuid references public.brands(id) on delete set null,
    name text not null,
    slug text not null unique,
    description text not null,
    long_description text,
    sku text not null unique,
    price decimal(12, 2) not null check (price >= 0),
    sale_price decimal(12, 2) check (sale_price >= 0 and sale_price <= price),
    discount decimal(5, 2) default 0.00 check (discount >= 0 and discount <= 100),
    rating decimal(3, 2) default 0.00 check (rating >= 0 and rating <= 5),
    reviews_count integer default 0 check (reviews_count >= 0),
    inventory integer not null default 0 check (inventory >= 0),
    options jsonb default '[]'::jsonb, -- Store variant types (e.g. colors, sizes, storage)
    status text not null default 'active' check (status in ('active', 'draft', 'out_of_stock', 'archived')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.product_variants (
    id uuid default gen_random_uuid() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    sku text not null unique,
    price decimal(12, 2) not null check (price >= 0),
    sale_price decimal(12, 2) check (sale_price >= 0 and sale_price <= price),
    inventory integer not null default 0 check (inventory >= 0),
    attributes jsonb not null default '{}'::jsonb, -- e.g. {"color": "Black", "storage": "256GB"}
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.product_images (
    id uuid default gen_random_uuid() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    variant_id uuid references public.product_variants(id) on delete cascade,
    url text not null,
    alt_text text,
    is_primary boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- 4. ADDRESSES & SHIPPING
-- ====================================================

create table public.addresses (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    type text not null check (type in ('shipping', 'billing')),
    name text not null,
    street text not null,
    city text not null,
    state text not null,
    postal_code text not null,
    country text not null default 'Nigeria',
    phone text not null,
    is_default boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.shipping_methods (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    cost decimal(12, 2) not null check (cost >= 0),
    estimated_days text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- 5. COUPONS & DISCOUNTS
-- ====================================================

create table public.coupons (
    id uuid default gen_random_uuid() primary key,
    code text not null unique,
    discount_type text not null check (discount_type in ('percentage', 'fixed')),
    discount_value decimal(12, 2) not null check (discount_value > 0),
    min_order_value decimal(12, 2) default 0.00 check (min_order_value >= 0),
    expires_at timestamp with time zone not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- 6. ORDERS, ITEMS & PAYMENTS
-- ====================================================

create table public.orders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete set null,
    status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal decimal(12, 2) not null check (subtotal >= 0),
    tax decimal(12, 2) not null default 0.00 check (tax >= 0),
    shipping decimal(12, 2) not null default 0.00 check (shipping >= 0),
    discount decimal(12, 2) default 0.00 check (discount >= 0),
    total decimal(12, 2) not null check (total >= 0),
    coupon_id uuid references public.coupons(id) on delete set null,
    shipping_method_id uuid references public.shipping_methods(id) on delete set null,
    tracking_number text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete set null,
    variant_id uuid references public.product_variants(id) on delete set null,
    quantity integer not null check (quantity > 0),
    price decimal(12, 2) not null check (price >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.payments (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    payment_method text not null, -- e.g. 'stripe', 'razorpay', 'paystack', 'paypal'
    transaction_id text not null,
    status text not null check (status in ('pending', 'succeeded', 'failed', 'refunded')),
    amount decimal(12, 2) not null check (amount >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- 7. REVIEWS & WISHLISTS
-- ====================================================

create table public.reviews (
    id uuid default gen_random_uuid() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    title text,
    comment text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(product_id, user_id)
);

create table public.wishlists (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, product_id)
);

-- ====================================================
-- 8. SYSTEM TABLES: NOTIFICATIONS, LOGS, ANALYTICS
-- ====================================================

create table public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    message text not null,
    is_read boolean default false not null,
    type text not null default 'general', -- e.g. 'order_status', 'promo', 'general'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.inventory_logs (
    id uuid default gen_random_uuid() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    variant_id uuid references public.product_variants(id) on delete cascade,
    stock_change integer not null, -- Positive (restock) or Negative (sale/return)
    type text not null check (type in ('restock', 'sale', 'return', 'adjustment')),
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.analytics (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete set null,
    event_type text not null, -- e.g. 'page_view', 'add_to_cart', 'purchase', 'search'
    event_data jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.audit_logs (
    id uuid default gen_random_uuid() primary key,
    admin_id uuid references public.profiles(id) on delete set null,
    action text not null, -- e.g. 'update_product', 'cancel_order', 'delete_user'
    table_name text not null,
    record_id uuid,
    details jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- PERFORMANCE TUNING: INDEXES
-- ====================================================

create index idx_products_slug on public.products(slug);
create index idx_products_category on public.products(category_id);
create index idx_products_brand on public.products(brand_id);
create index idx_products_status on public.products(status);
create index idx_variants_product on public.product_variants(product_id);
create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order on public.order_items(order_id);
create index idx_reviews_product on public.reviews(product_id);
create index idx_wishlist_user on public.wishlists(user_id);
create index idx_addresses_user on public.addresses(user_id);

-- ====================================================
-- SYSTEM TRIGGERS & FUNCTIONS
-- ====================================================

-- 1. Auto update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.update_updated_at_column();
create trigger set_categories_updated_at before update on public.categories for each row execute procedure public.update_updated_at_column();
create trigger set_brands_updated_at before update on public.brands for each row execute procedure public.update_updated_at_column();
create trigger set_products_updated_at before update on public.products for each row execute procedure public.update_updated_at_column();
create trigger set_variants_updated_at before update on public.product_variants for each row execute procedure public.update_updated_at_column();
create trigger set_addresses_updated_at before update on public.addresses for each row execute procedure public.update_updated_at_column();
create trigger set_orders_updated_at before update on public.orders for each row execute procedure public.update_updated_at_column();

-- 2. Automatic profile insertion on Auth Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, full_name, avatar_url, role)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        coalesce(new.raw_user_meta_data->>'avatar_url', ''),
        coalesce(new.raw_user_meta_data->>'role', 'customer')
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ====================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.addresses enable row level security;
alter table public.shipping_methods enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.notifications enable row level security;
alter table public.inventory_logs enable row level security;
alter table public.analytics enable row level security;
alter table public.audit_logs enable row level security;

-- Simple public viewing rules (Read-only for guests)
create policy "Allow public read categories" on public.categories for select using (true);
create policy "Allow public read brands" on public.brands for select using (true);
create policy "Allow public read products" on public.products for select using (status = 'active');
create policy "Allow public read variants" on public.product_variants for select using (true);
create policy "Allow public read images" on public.product_images for select using (true);
create policy "Allow public read reviews" on public.reviews for select using (true);
create policy "Allow public read shipping methods" on public.shipping_methods for select using (true);

-- Client CRUD policies
create policy "Allow profile owner access" on public.profiles for all using (auth.uid() = id);
create policy "Allow owner address management" on public.addresses for all using (auth.uid() = user_id);
create policy "Allow owner wishlist management" on public.wishlists for all using (auth.uid() = user_id);
create policy "Allow owner notification management" on public.notifications for all using (auth.uid() = user_id);
create policy "Allow owner reviews write" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Allow owner reviews update_delete" on public.reviews for update using (auth.uid() = user_id);

-- Order creation and monitoring
create policy "Allow owner orders view" on public.orders for select using (auth.uid() = user_id);
create policy "Allow customer order placement" on public.orders for insert with check (auth.uid() = user_id);
create policy "Allow owner order items view" on public.order_items for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Allow owner order items insertion" on public.order_items for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Allow owner payments view" on public.payments for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);

-- Admin CRUD policies (Universal control for roles matching 'admin')
create or replace function public.is_admin()
returns boolean as $$
begin
    return exists (
        select 1 from public.profiles 
        where id = auth.uid() and role = 'admin'
    );
end;
$$ language plpgsql security definer;

create policy "Admin categories master control" on public.categories for all using (public.is_admin());
create policy "Admin brands master control" on public.brands for all using (public.is_admin());
create policy "Admin products master control" on public.products for all using (public.is_admin());
create policy "Admin variants master control" on public.product_variants for all using (public.is_admin());
create policy "Admin images master control" on public.product_images for all using (public.is_admin());
create policy "Admin orders master control" on public.orders for all using (public.is_admin());
create policy "Admin order items master control" on public.order_items for all using (public.is_admin());
create policy "Admin coupons master control" on public.coupons for all using (public.is_admin());
create policy "Admin addresses master control" on public.addresses for all using (public.is_admin());
create policy "Admin profile monitor" on public.profiles for all using (public.is_admin());
create policy "Admin payments master control" on public.payments for all using (public.is_admin());
create policy "Admin notifications master control" on public.notifications for all using (public.is_admin());
create policy "Admin logs read" on public.inventory_logs for select using (public.is_admin());
create policy "Admin logs edit" on public.inventory_logs for insert using (public.is_admin());
create policy "Admin audit view" on public.audit_logs for select using (public.is_admin());
create policy "Admin analytics view" on public.analytics for select using (public.is_admin());
