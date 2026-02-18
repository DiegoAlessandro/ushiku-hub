import { web_search } from "openclaw-core";
// @ts-ignore
const { finalizeStoreData } = require("./data-finalizer");

/**
 * 統合型：Instagramから牛久の情報を収集し、AIで加工してサイトに反映する
 */
async function integratedCollector() {
  console.log("🚀 Integrated Collector Started...");

  const queries = [
    "site:instagram.com #牛久グルメ",
    "site:instagram.com #牛久市",
    "site:instagram.com #うしくさんぽ",
    "site:instagram.com #ひたち野うしく",
    "site:instagram.com #牛久テイクアウト",
    "site:instagram.com #牛久駅",
    "site:instagram.com #牛久大仏",
    "site:instagram.com #牛久シャトー",
    "site:instagram.com #牛久習い事"
  ];

  for (const query of queries) {
    const results = await web_search({ query, count: 5, search_lang: "jp" });

    for (const result of results.results) {
        const storeNameMatch = result.title.match(/@([a-zA-Z0-9._]+)/) || result.title.match(/(.*?) \(/);
        const storeName = storeNameMatch ? storeNameMatch[1] : result.title.split(' • ')[0];

        const rawData = {
            name: storeName,
            category: 'other', // AIが後で修正する
            source: 'instagram',
            sourceUrl: result.url,
            content: result.description || "内容なし",
            imageUrl: "", // 必要に応じて画像抽出プロトタイプと統合
            postedAt: new Date().toISOString()
        };

        await finalizeStoreData(rawData);
    }
  }

  console.log("🏁 Integrated Collection Cycle Finished.");
}

// 実行
// integratedCollector();
