import { web_search, web_fetch } from "openclaw-core";

/**
 * 食べログや地域ブログなど、ソースを拡大して牛久の最新情報を収集するエージェント
 */
async function extendedCollector() {
  const HUB_API_URL = "https://ushiku-hub.vercel.app/api/collect";
  const CRON_SECRET = "ushiku_hub_secret_2026";

  console.log("🌐 ソース拡大：食べログ・地域ブログの巡回を開始...");

  const queries = [
    "site:tabelog.com 牛久市 掲載店",
    "牛久市 地域ブログ 最新",
    "牛久市 開店 閉店 2026"
  ];

  for (const query of queries) {
    const results = await web_search({ query, count: 3, search_lang: "jp" });

    for (const result of results.results) {
        // AIエディターによる分類と要約を経て送信する流れ
        console.log(`📡 収集候補: ${result.title}`);
        
        const payload = {
            source: 'web',
            category: 'other', // 一旦otherで送り、AIエディターで後で修正
            name: result.title.split(' - ')[0],
            content: result.description,
            sourceUrl: result.url,
            postedAt: new Date().toISOString()
        };

        try {
            await fetch(HUB_API_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${CRON_SECRET}`
                },
                body: JSON.stringify(payload)
            });
            console.log(`✅ 送信: ${payload.name}`);
        } catch (e) {
            console.error(e.message);
        }
    }
  }
}
