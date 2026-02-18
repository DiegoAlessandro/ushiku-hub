const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
const sql = neon(databaseUrl);

async function run() {
  console.log("🏷️ Adding tags column to database...");
  await sql`ALTER TABLE stores ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'`;
  await sql`CREATE INDEX IF NOT EXISTS idx_stores_tags ON stores USING GIN (tags)`;
  
  // テストデータにタグを設定
  console.log("📝 Setting test tags...");
  await sql`UPDATE stores SET tags = ARRAY['駐車場あり', 'ラーメン'] WHERE name = 'ラーメンショップ 牛久結束店'`;
  await sql`UPDATE stores SET tags = ARRAY['観光', 'ワイン', '駐車場あり'] WHERE name = '牛久シャトー'`;
  await sql`UPDATE stores SET tags = ARRAY['駅近', '朝食'] WHERE name = '駅うどん 牛久店'`;
  await sql`UPDATE stores SET tags = ARRAY['駐車場あり', 'ランチ'] WHERE name = 'とんかつ とんQ 牛久店'`;
  await sql`UPDATE stores SET tags = ARRAY['カフェ', '駅近'] WHERE name = 'サイトウコーヒー'`;
  await sql`UPDATE stores SET tags = ARRAY['観光', 'パワースポット'] WHERE name = '牛久大仏（観光案内）'`;

  console.log("✅ Done.");
  process.exit(0);
}
run();
