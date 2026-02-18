const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

// Load env
dotenv.config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
const sql = neon(databaseUrl);

async function runManualCollection() {
  console.log("🔍 手動データ抽出を開始します...");

  // サンプルデータ（実際の抽出シミュレーション）
  const discoveredStores = [
    {
      name: "とんかつ とんQ 牛久店",
      category: "food",
      source: "web",
      source_url: "https://tonq.com/shop/ushiku/",
      content: "茨城で人気のとんかつ専門店。厳選された国産豚と炊き立てご飯が絶品です。牛久シャトーのすぐ近く！",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
      instagram_account: "tonq_official"
    },
    {
      name: "サイトウコーヒー",
      category: "food",
      source: "instagram",
      source_url: "https://www.instagram.com/saitocoffee/",
      content: "牛久駅近くの自家焙煎珈琲店。落ち着いた空間でこだわりの一杯を。 #牛久カフェ #自家焙煎",
      image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
      instagram_account: "saitocoffee"
    },
    {
      name: "牛久大仏（観光案内）",
      category: "event",
      source: "web",
      source_url: "https://daibutu.net/event",
      content: "世界最大の青銅製大仏。季節ごとのライトアップや園内イベント情報を公開中。週末は家族連れで賑わいます。",
      image_url: "https://images.unsplash.com/photo-1545562083-a600704fa487?w=800",
      instagram_account: ""
    }
  ];

  for (const store of discoveredStores) {
    try {
      await sql`
        INSERT INTO stores (
          id, name, category, source, source_url, content, image_url, 
          instagram_account, is_published, collected_at
        ) VALUES (
          gen_random_uuid(), ${store.name}, ${store.category}, ${store.source}, 
          ${store.source_url}, ${store.content}, ${store.image_url}, 
          ${store.instagramAccount}, true, NOW()
        )
        ON CONFLICT (source_url) DO NOTHING
      `;
      console.log(`✅ 抽出成功: ${store.name}`);
    } catch (err) {
      console.error(`❌ 抽出失敗: ${store.name}`, err.message);
    }
  }

  console.log("🏁 手動抽出が完了しました。サイトを確認してください。");
  process.exit(0);
}

runManualCollection();
