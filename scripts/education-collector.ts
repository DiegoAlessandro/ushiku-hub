import { web_search } from "openclaw-core";

/**
 * 牛久市内の習い事（塾、スクール、スポーツ教室）を収集するエージェント
 */
async function educationCollector() {
  const HUB_API_URL = "https://ushiku-hub.vercel.app/api/collect";
  const CRON_SECRET = "ushiku_hub_secret_2026";

  console.log("🎓 習い事・スクール情報の収集を開始...");

  const queries = [
    "牛久市 習い事 子供 最新",
    "牛久市 塾 生徒募集",
    "牛久市 ピアノ教室 インスタ",
    "牛久市 サッカースクール 募集",
    "牛久市 英会話教室 キャンペーン"
  ];

  for (const query of queries) {
    const results = await web_search({ query, count: 3, search_lang: "jp" });

    for (const result of results.results) {
        console.log(`📡 発見: ${result.title}`);
        
        const payload = {
            source: 'web',
            category: 'education',
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
            console.log(`✅ 送信成功: ${payload.name}`);
        } catch (e) {
            console.error(e.message);
        }
    }
  }
}
