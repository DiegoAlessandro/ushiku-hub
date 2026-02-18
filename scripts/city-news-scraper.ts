import { web_search, browser } from "openclaw-core";

/**
 * 牛久市公式HPの「新着情報」から最新の行政・イベントニュースを画像付きで抽出する
 */
async function scrapeCityNewsRich() {
  const HUB_API_URL = "https://ushiku-hub.vercel.app/api/collect";
  const CRON_SECRET = "ushiku_hub_secret_2026";
  const TARGET_URL = "https://www.city.ushiku.lg.jp/news.php?type=0";

  console.log("🏢 牛久市公式HPのビジュアル解析を開始...");

  // 1. ブラウザでニュース一覧を開く
  await browser({
    action: "navigate",
    targetUrl: TARGET_URL
  });

  // 2. ページ内のニュース要素と、それに関連する画像を特定
  const newsData = await browser({
    action: "act",
    request: {
      kind: "evaluate",
      fn: `() => {
        const items = [];
        const dlElements = document.querySelectorAll(".news_list dl");
        
        dlElements.forEach((dl, i) => {
          if (i >= 3) return; // 最新3件に絞る
          
          const title = dl.querySelector("dd a")?.innerText;
          const href = dl.querySelector("dd a")?.getAttribute("href");
          const date = dl.querySelector("dt")?.innerText;
          
          // 画像があれば取得（ニュース詳細へのリンクからサムネイルを推測、またはロゴをフォールバック）
          const img = dl.querySelector("img")?.src || "https://www.city.ushiku.lg.jp/images/common/logo.png";
          
          if (title && href) {
            items.push({
              name: "牛久市役所",
              category: "event",
              source: "web",
              sourceUrl: "https://www.city.ushiku.lg.jp/" + href,
              content: title + " (" + date + ")",
              imageUrl: img,
              postedAt: new Date().toISOString()
            });
          }
        });
        return items;
      }`
    }
  });

  // 3. 取得したニュースを一つずつAPIに送信
  for (const item of newsData) {
    try {
      const res = await fetch(HUB_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CRON_SECRET}`
        },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        console.log(`✅ ニュース送信成功: ${item.content}`);
      }
    } catch (err) {
      console.error("❌ 送信エラー:", err.message);
    }
  }

  console.log("🏁 ニュース収集プロトタイプ完了");
}
