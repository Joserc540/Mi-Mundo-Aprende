-- Mi Mundo Aprende - gamification layer
-- Safe to run repeatedly on PostgreSQL.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE child_profiles
  ADD COLUMN IF NOT EXISTS ab_group VARCHAR(10) DEFAULT 'A',
  ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS equipped_items JSONB DEFAULT '{"aura": null, "hair": "default", "outfit": "default", "accessory": null, "pet": null}'::jsonb;

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS narrative_variants JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS narrative_hints JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS validation_status VARCHAR(40) DEFAULT 'PENDING_TEACHER_REVIEW';

CREATE TABLE IF NOT EXISTS shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  universe_id VARCHAR(50) NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('aura', 'hair', 'outfit', 'accessory', 'pet')),
  price INTEGER NOT NULL DEFAULT 50 CHECK (price >= 0),
  asset_url TEXT NOT NULL,
  z_index INTEGER NOT NULL DEFAULT 10,
  min_level_required INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS child_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, item_id)
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE SET NULL,
  event_type VARCHAR(80) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
