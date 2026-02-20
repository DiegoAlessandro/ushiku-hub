import { web_search } from "openclaw-core";
// @ts-ignore
const { finalizeStoreData } = require("./data-finalizer");

/**
 * 統合型：Instagramから牛久の情報を収集し、AIで加工してサイトに反映する
 * ※ OpenClaw Agent 環境でのみ動作（web_search は openclaw-core 提供）
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

  let totalCollected = 0;

  for (const query of queries) {
    try {
      const results = await web_search({ query, count: 5, search_lang: "jp" });

      if (!results?.results?.length) {
        console.log(`⚠️ No results for: ${query}`);
        continue;
      }

      console.log(`🔍 ${query} → ${results.results.length} results`);

      for (const result of results.results) {
        const storeNameMatch = result.title.match(/@([a-zA-Z0-9._]+)/) || result.title.match(/(.*?) \(/);
        const storeName = storeNameMatch ? storeNameMatch[1] : result.title.split(' • ')[0];

        if (!storeName || storeName.length < 2) continue;

        // finalizeStoreData 経由（品質ゲート + AI enrichment）
        await finalizeStoreData({
          name: storeName,
          category: 'other', // AI が後で修正する
          source: 'instagram',
          sourceUrl: result.url,
          content: result.description || result.title,
          imageUrl: '',
          postedAt: new Date().toISOString(),
          rawContent: result.description || undefined,
        });

        totalCollected++;
      }
    } catch (err: any) {
      console.error(`❌ Error for query "${query}":`, err.message);
    }
  }

  console.log(`\n🏁 Integrated Collection Finished. (${totalCollected} items processed)`);
}

integratedCollector();
