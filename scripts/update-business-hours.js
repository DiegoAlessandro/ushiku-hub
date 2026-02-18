const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
const sql = neon(databaseUrl);

async function run() {
  console.log("🕒 Adding business hours columns to database...");
  await sql`ALTER TABLE stores ADD COLUMN IF NOT EXISTS business_hours VARCHAR(100)`;
  await sql`ALTER TABLE stores ADD COLUMN IF NOT EXISTS regular_holiday VARCHAR(100)`;
  
  // テストデータの営業時間を設定
  console.log("📝 Setting test business hours...");
  await sql`UPDATE stores SET business_hours = '10:45-23:15', regular_holiday = 'なし' WHERE name = 'ラーメンショップ 牛久結束店'`;
  await sql`UPDATE stores SET business_hours = '10:00-18:00', regular_holiday = '年末年始' WHERE name = '牛久シャトー'`;
  await sql`UPDATE stores SET business_hours = '11:00-19:00', regular_holiday = '月曜' WHERE name = '駅うどん 牛久店'`;

  console.log("✅ Done.");
  process.exit(0);
}
run();
