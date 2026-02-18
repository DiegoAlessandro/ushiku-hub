const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
const sql = neon(databaseUrl);

async function run() {
  console.log("📍 Adding location columns to database...");
  await sql`ALTER TABLE stores ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION`;
  await sql`ALTER TABLE stores ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION`;
  await sql`CREATE INDEX IF NOT EXISTS idx_stores_location ON stores(latitude, longitude)`;
  
  // テストデータの座標を更新（牛久駅周辺）
  console.log("🗺️ Setting test coordinates...");
  await sql`UPDATE stores SET latitude = 35.9796, longitude = 140.1472 WHERE name = 'ラーメンショップ 牛久結束店'`;
  await sql`UPDATE stores SET latitude = 35.9839, longitude = 140.1557 WHERE name = '牛久シャトー'`;
  await sql`UPDATE stores SET latitude = 35.9791, longitude = 140.1481 WHERE name = '駅うどん 牛久店'`;
  await sql`UPDATE stores SET latitude = 35.9863, longitude = 140.1378 WHERE name = 'とんかつ とんQ 牛久店'`;
  await sql`UPDATE stores SET latitude = 35.9785, longitude = 140.1492 WHERE name = 'サイトウコーヒー'`;
  await sql`UPDATE stores SET latitude = 36.0024, longitude = 140.1652 WHERE name = '牛久大仏（観光案内）'`;

  console.log("✅ Done.");
  process.exit(0);
}
run();
