import { web_search, web_fetch } from "openclaw-core";
// @ts-ignore
const { finalizeStoreData } = require("./data-finalizer");

/**
 * 牛久市内の主要スーパー（カスミ、ヨークベニマル、タイヨー等）の最新チラシ・セール情報を収集する
 */
async function supermarketCollector() {
  console.log("🛒 スーパーマーケット特売情報の巡回を開始...");

  const queries = [
    "カスミ 牛久市 チラシ 最新",
    "ヨークベニマル 牛久市 特売",
    "タイヨー 牛久店 セール情報",
    "ヒーロー 牛久中央店 チラシ"
  ];

  for (const query of queries) {
    const results = await web_search({ query, count: 3, search_lang: "jp" });

    for (const result of results.results) {
        console.log(`📡 スーパー情報発見: ${result.title}`);
        
        const rawData = {
            name: result.title.split(' | ')[0].split(' - ')[0],
            category: 'shop',
            source: 'web',
            sourceUrl: result.url,
            content: `【スーパー特売情報】${result.description || "チラシをチェックしてください"}`,
            imageUrl: "", // 将来的にチラシ画像を抽出
            postedAt: new Date().toISOString()
        };

        // 名寄せとAI要約を経て保存
        await finalizeStoreData(rawData);
    }
  }

  console.log("🏁 スーパー巡回完了");
}

// 運用フローに統合済み
