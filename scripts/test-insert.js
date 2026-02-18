const { neon } = require("@neondatabase/serverless");

// テスト用データ投入スクリプト
async function runTestCollection() {
  const databaseUrl = "postgresql://neondb_owner:npg_ZqUzkxCX4c5i@ep-solitary-fog-ainb6oba-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const sql = neon(databaseUrl);

  const testStores = [
    {
      name: "ラーメンショップ 牛久結束店",
      category: "food",
      source: "instagram",
      source_url: "https://www.instagram.com/ramenshop_ushikukessoku/",
      content: "日本一のラーショ！こってり脂に自家製麺が最高に合います。今日も大行列です。 #牛久グルメ #ラーショ",
      image_url: "https://images.unsplash.com/photo-1591814448473-7057b99923ad?w=800",
      instagram_account: "ramenshop_ushikukessoku"
    },
    {
      name: "牛久シャトー",
      category: "food",
      source: "web",
      source_url: "https://www.ushiku-chateau.jp/news/1",
      content: "ワイン文化発祥の地、牛久シャトー。本日より春の限定メニューを開始しました。歴史ある建物で優雅なひとときを。",
      image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
      instagram_account: ""
    },
    {
      name: "駅うどん 牛久店",
      category: "food",
      source: "instagram",
      source_url: "https://www.instagram.com/eki.udon.ushiku/",
      content: "牛久駅改札外のうどん屋さん。いりこ出汁が効いた優しい味。朝食にもぴったりです！ #牛久駅 #牛久グルメ",
      image_url: "https://images.unsplash.com/photo-1617343251257-b5d709934989?w=800",
      instagram_account: "eki.udon.ushiku"
    }
  ];

  console.log("🧪 Running test collection...");

  for (const store of testStores) {
    try {
      await sql`
        INSERT INTO stores (
          id, name, category, source, source_url, content, image_url, 
          instagram_account, is_published, collected_at
        ) VALUES (
          gen_random_uuid(), ${store.name}, ${store.category}, ${store.source}, 
          ${store.source_url}, ${store.content}, ${store.image_url}, 
          ${store.instagram_account}, true, NOW()
        )
        ON CONFLICT (source_url) DO NOTHING
      `;
      console.log(`✅ Inserted: ${store.name}`);
    } catch (err) {
      console.error(`❌ Failed: ${store.name}`, err.message);
    }
  }

  console.log("🏁 Test collection finished.");
  process.exit(0);
}

runTestCollection();
