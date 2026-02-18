import { web_search, web_fetch } from "openclaw-core";

/**
 * 牛久市のInstagram店舗情報を収集し、Ushiku Hub APIに送信するエージェントプロトタイプ
 */
async function collectUshikuStores() {
  const HUB_API_URL = "https://ushiku-hub.vercel.app/api/collect";
  const CRON_SECRET = "ushiku_hub_secret_2026";

  console.log("🔍 Starting Ushiku store collection...");

  // 1. Instagram投稿をWeb検索で探す (ハッシュタグ検索の代わり)
  const searchQuery = "site:instagram.com #牛久グルメ";
  const searchResults = await web_search({
    query: searchQuery,
    count: 5,
    search_lang: "jp"
  });

  for (const result of searchResults.results) {
    console.log(`📡 Processing: ${result.title}`);
    
    // タイトルから店名を推測 (簡易版)
    const storeNameMatch = result.title.match(/@([a-zA-Z0-9._]+)/) || result.title.match(/(.*?) \(/);
    const storeName = storeNameMatch ? storeNameMatch[1] : "不明な店舗";

    // 2. Ushiku Hub APIにデータを送信
    const payload = {
      source: 'instagram',
      category: 'food',
      name: storeName,
      content: result.description || "内容なし",
      imageUrl: "", // 検索結果から画像URLが取れる場合は設定
      sourceUrl: result.url,
      postedAt: new Date().toISOString(), // 簡易的に現在時刻
      instagramAccount: storeNameMatch ? storeNameMatch[1] : ""
    };

    try {
      const response = await fetch(HUB_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CRON_SECRET}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (response.ok) {
        console.log(`✅ Success: ${storeName}`);
      } else {
        console.error(`❌ Failed: ${storeName}`, resData);
      }
    } catch (err) {
      console.error(`🔥 Error sending to Hub: ${err.message}`);
    }
  }

  console.log("🏁 Collection finished.");
}

// テスト実行用 (実際はOpenClawのcronで回す)
// collectUshikuStores();
