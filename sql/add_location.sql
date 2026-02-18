-- 位置情報を追加
ALTER TABLE stores ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_stores_location ON stores(latitude, longitude);
