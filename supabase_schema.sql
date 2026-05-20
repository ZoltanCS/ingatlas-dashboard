-- ============================================================
-- Ingatlas Dashboard — Supabase Database Schema
-- Futtasd ezt a Supabase SQL Editorban:
-- https://uhuacquwruvefadeaogd.supabase.co → SQL Editor
-- ============================================================

-- Engedélyezd a UUID generálást
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. LISTINGS (Felvételek / Ingatlanok)
-- ============================================================
CREATE TABLE IF NOT EXISTS listings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address           TEXT NOT NULL,
  type              TEXT NOT NULL DEFAULT 'Lakás',
  plan              TEXT NOT NULL DEFAULT 'basic',
  status            TEXT NOT NULL DEFAULT 'active',
  rooms             INTEGER DEFAULT 1,
  sqm               INTEGER,
  price             TEXT,
  visits            INTEGER DEFAULT 0,
  chatbot_questions INTEGER DEFAULT 0,
  embed_url         TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  expires_at        TIMESTAMPTZ DEFAULT (now() + INTERVAL '90 days')
);

CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own listings"
  ON listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================================
-- 2. VISITS (Látogatói adatok)
-- ============================================================
CREATE TABLE IF NOT EXISTS visits (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id       UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  visited_at       TIMESTAMPTZ DEFAULT now(),
  source           TEXT DEFAULT 'direct',
  duration_seconds INTEGER DEFAULT 0
);

CREATE INDEX idx_visits_listing_id ON visits(listing_id);
CREATE INDEX idx_visits_visited_at ON visits(visited_at DESC);

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view visits for own listings"
  ON visits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = visits.listing_id
      AND listings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert visits for own listings"
  ON visits FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = visits.listing_id
      AND listings.user_id = auth.uid()
    )
  );


-- ============================================================
-- 3. CHATBOT_QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS chatbot_questions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  question   TEXT NOT NULL,
  category   TEXT DEFAULT 'egyéb',
  count      INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chatbot_questions_listing_id ON chatbot_questions(listing_id);
CREATE INDEX idx_chatbot_questions_category ON chatbot_questions(category);

ALTER TABLE chatbot_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view questions for own listings"
  ON chatbot_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = chatbot_questions.listing_id
      AND listings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert questions for own listings"
  ON chatbot_questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = chatbot_questions.listing_id
      AND listings.user_id = auth.uid()
    )
  );


-- ============================================================
-- 4. HEATMAP_DATA (Szoba-hőtérkép)
-- ============================================================
CREATE TABLE IF NOT EXISTS heatmap_data (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id   UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  room_name    TEXT NOT NULL,
  time_percent NUMERIC DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_heatmap_listing_id ON heatmap_data(listing_id);

ALTER TABLE heatmap_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view heatmap for own listings"
  ON heatmap_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = heatmap_data.listing_id
      AND listings.user_id = auth.uid()
    )
  );


-- ============================================================
-- 5. SEO_TEXTS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_texts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  excerpt    TEXT DEFAULT '',
  status     TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_seo_texts_listing_id ON seo_texts(listing_id);

ALTER TABLE seo_texts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view SEO texts for own listings"
  ON seo_texts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = seo_texts.listing_id
      AND listings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert SEO texts for own listings"
  ON seo_texts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = seo_texts.listing_id
      AND listings.user_id = auth.uid()
    )
  );


-- ============================================================
-- 6. TEAM_MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email     TEXT NOT NULL,
  name      TEXT NOT NULL,
  role      TEXT NOT NULL DEFAULT 'viewer',
  joined_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_team_members_owner_id ON team_members(owner_id);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own team members"
  ON team_members FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own team members"
  ON team_members FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own team members"
  ON team_members FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own team members"
  ON team_members FOR DELETE
  USING (auth.uid() = owner_id);
