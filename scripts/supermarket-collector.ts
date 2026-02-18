import { web_search } from "openclaw-core";
// @ts-ignore
const { finalizeStoreData } = require("./data-finalizer");

/**
 * 牛久市内の主要スーパーのチラシ・特売情報を収集するエージェント
 */
async function supermarketCollector() {
  console.log("🛒 牛久スーパー特売情報の収集を開始...");

  const shops = [
    "カスミ 牛久",
    "ヨークベニマル 牛久",
    "フードスクエア 牛久",
    "ディスカウントストア ヒーロー 牛久",
    "業務スーパー 牛久"
  ];

  for (const shop of shops) {
    console.log(`🔎 Searching for: ${shop}`);
    const results = await web_search({ 
        query: `${shop} 最新チラシ 特売 お買い得`, 
        count: 3, 
        search_lang: "jp" 
    });

    for (const result of results.results) {
        const rawData = {
            name: shop,
            category: 'shop',
            source: 'web',
            sourceUrl: result.url,
            content: `【特売・チラシ情報】${result.title}\n${result.description}`,
            imageUrl: "", // 将来的にチラシ画像をパース
            postedAt: new Date().toISOString()
        };

        await finalizeStoreData(rawData);
    }
  }

  console.log("🏁 スーパー情報収集サイクル完了");
}

// 実行
