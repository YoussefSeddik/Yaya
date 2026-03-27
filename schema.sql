-- =====================================================
-- myStore E-commerce — Supabase Database Schema
-- Run this in your Supabase SQL Editor → New Query
-- =====================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  name_ar       TEXT,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL,
  cost          NUMERIC(10,2) NOT NULL DEFAULT 0,
  category      TEXT NOT NULL,
  image         TEXT NOT NULL DEFAULT '',
  stock         INTEGER NOT NULL DEFAULT 0,
  sku           TEXT UNIQUE NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  sizes         TEXT[] NOT NULL DEFAULT '{}',
  colors        TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  phone               TEXT NOT NULL,
  email               TEXT,
  address_street      TEXT,
  address_area        TEXT,
  address_city        TEXT,
  address_governorate TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT UNIQUE NOT NULL,
  customer_id     UUID REFERENCES customers(id),
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','shipped','delivered')),
  subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_fee    NUMERIC(10,2) NOT NULL DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_cost      NUMERIC(10,2) NOT NULL DEFAULT 0,
  profit          NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method  TEXT NOT NULL DEFAULT 'cod'
                    CHECK (payment_method IN ('cod','card','transfer')),
  payment_status  TEXT NOT NULL DEFAULT 'unpaid'
                    CHECK (payment_status IN ('unpaid','paid')),
  source          TEXT NOT NULL DEFAULT 'website'
                    CHECK (source IN ('website','whatsapp','instagram','facebook')),
  notes           TEXT,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  shipped_at      TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ
);

-- 4. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity     INTEGER NOT NULL DEFAULT 1,
  price        NUMERIC(10,2) NOT NULL,
  cost         NUMERIC(10,2) NOT NULL DEFAULT 0,
  size         TEXT,
  color        TEXT
);

-- =====================================================
-- INDEXES (for fast lookups)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_orders_customer    ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date        ON orders(date DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active    ON products(is_active);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read active products, service_role can write
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role manages products"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Customers: service_role only (admin dashboard uses service role key)
CREATE POLICY "Service role manages customers"
  ON customers FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Orders: anyone can INSERT (checkout), service_role can do everything
CREATE POLICY "Anyone can place an order"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role manages orders"
  ON orders FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Order items: anyone can insert with a valid order, service_role manages all
CREATE POLICY "Anyone can add order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role manages order items"
  ON order_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- SEED: Sample products (optional — delete if not needed)
-- =====================================================
INSERT INTO products (name, price, cost, stock, sku, category, image, sizes, colors, is_active)
VALUES
  ('Oversized Graphic Tee',     350, 180, 24, 'SH-TEE-001', 'Tops',        '👕', ARRAY['S','M','L','XL'], ARRAY['Black','White','Gray'],          true),
  ('High Waist Cargo Pants',    520, 280, 18, 'SH-PNT-002', 'Bottoms',     '👖', ARRAY['S','M','L'],      ARRAY['Khaki','Black'],                  true),
  ('Mini Crossbody Bag',        280, 120, 32, 'SH-BAG-003', 'Accessories', '👜', ARRAY[]::TEXT[],         ARRAY['Black','Pink','White'],           true),
  ('Pleated Mini Skirt',        320, 160, 15, 'SH-SKT-004', 'Bottoms',     '👗', ARRAY['S','M','L'],      ARRAY['Black','Navy','Plaid'],            true),
  ('Chunky Platform Sneakers',  650, 350,  8, 'SH-SHO-005', 'Shoes',       '👟', ARRAY['36','37','38','39','40'], ARRAY['White','Black'],           true),
  ('Layered Chain Necklace',    150,  45, 50, 'SH-ACC-006', 'Accessories', '📿', ARRAY[]::TEXT[],         ARRAY['Gold','Silver'],                  true)
ON CONFLICT (sku) DO NOTHING;
