-- 店舗情報テーブル
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('food', 'beauty', 'shop', 'event', 'other')),
  source VARCHAR(50) NOT NULL CHECK (source IN ('instagram', 'twitter', 'web')),
  source_url TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  image_url TEXT,
  posted_at TIMESTAMP WITH TIME ZONE,
  collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  address TEXT,
  phone VARCHAR(50),
  instagram_account VARCHAR(255),
  is_published BOOLEAN DEFAULT true
);

-- インデックス
CREATE INDEX idx_stores_category ON stores(category);
CREATE INDEX idx_stores_collected_at ON stores(collected_at DESC);
CREATE INDEX idx_stores_source ON stores(source);
CREATE INDEX idx_stores_is_published ON stores(is_published);
