const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

const FETCH_TIMEOUT_MS = 5000;
const USER_AGENT =
  "Mozilla/5.0 (compatible; UshikuHubBot/1.0; +https://ushiku-hub.jp)";

const OG_IMAGE_REGEX =
  /<meta\s+(?:[^>]*?\s)?property=["']og:image["']\s+content=["']([^"']+)["'][^>]*>/i;
const OG_IMAGE_REGEX_REVERSE =
  /<meta\s+(?:[^>]*?\s)?content=["']([^"']+)["']\s+property=["']og:image["'][^>]*>/i;

async function fetchOgImage(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      redirect: "follow",
    });

    clearTimeout(timeoutId);
    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(OG_IMAGE_REGEX) ?? html.match(OG_IMAGE_REGEX_REVERSE);
    if (!match?.[1]) return null;

    const imageUrl = match[1].trim();
    if (imageUrl.startsWith("//")) return `https:${imageUrl}`;
    if (imageUrl.startsWith("/")) {
      const origin = new URL(url).origin;
      return `${origin}${imageUrl}`;
    }
    return imageUrl;
  } catch {
    return null;
  }
}

async function run() {
  console.log("🖼️  OGP画像バックフィル開始...\n");

  const rows = await sql`
    SELECT id, name, source_url
    FROM stores
    WHERE is_published = true
      AND (image_url IS NULL OR image_url = '')
      AND source_url IS NOT NULL
      AND source_url != ''
  `;

  console.log(`📋 対象: ${rows.length}件\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of rows) {
    const { id, name, source_url } = row;
    process.stdout.write(`  ${name} ... `);

    const imageUrl = await fetchOgImage(source_url);

    if (imageUrl) {
      await sql`UPDATE stores SET image_url = ${imageUrl} WHERE id = ${id}`;
      console.log(`✅ ${imageUrl.substring(0, 60)}...`);
      success++;
    } else {
      console.log("❌ OGP画像なし");
      failed++;
    }
  }

  console.log(`\n📊 結果: 成功=${success} 失敗=${failed} スキップ=${skipped}`);
  console.log("✅ バックフィル完了");
  process.exit(0);
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
