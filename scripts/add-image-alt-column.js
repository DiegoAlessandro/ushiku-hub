const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
const sql = neon(databaseUrl);

async function run() {
  console.log("🖼️ Adding image_alt column to database...");
  await sql`ALTER TABLE stores ADD COLUMN IF NOT EXISTS image_alt TEXT`;
  console.log("✅ Done.");
  process.exit(0);
}
run();
