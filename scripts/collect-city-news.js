const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
const axios = require("axios");
const cheerio = require("cheerio");
const { finalizeStoreData } = require("./data-finalizer");

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

const BASE_URL = "https://www.city.ushiku.lg.jp";
const NEWS_URL = `${BASE_URL}/news.php?type=0`;
const MAX_CONTENT_LENGTH = 500;

/**
 * 詳細ページから本文テキストを抽出する
 */
async function fetchArticleBody(url) {
  try {
    const { data } = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(data);

    // 不要要素を除去
    $("script, style, nav, footer, .enquete, .breadcrumb, .pagetop").remove();

    // 本文候補セレクタ（優先度順）
    const selectors = [
      "#main_body",
      ".main_body",
      "#contents .detail",
      "#contents",
      ".main",
      "article",
    ];

    let bodyText = "";
    for (const sel of selectors) {
      const el = $(sel);
      if (el.length > 0) {
        bodyText = el.find("p, li, dd, td, h2, h3, h4")
          .map((_, e) => $(e).text().trim())
          .get()
          .filter(Boolean)
          .join("\n");
        if (bodyText.length > 30) break;
      }
    }

    // セレクタでうまく取れなかった場合、全pタグからフォールバック
    if (bodyText.length < 30) {
      bodyText = $("p")
        .map((_, e) => $(e).text().trim())
        .get()
        .filter((t) => t.length > 10)
        .join("\n");
    }

    return bodyText.slice(0, MAX_CONTENT_LENGTH);
  } catch (err) {
    console.warn(`⚠️ 詳細ページ取得失敗 (${url}): ${err.message}`);
    return "";
  }
}

async function collectCityNews() {
  console.log("🏢 牛久市公式HPからニュースを抽出中...");

  try {
    const { data } = await axios.get(NEWS_URL, { timeout: 10000 });
    const $ = cheerio.load(data);

    const newsItems = [];

    $(".newsListIndex dl").each((i, el) => {
      if (i >= 5) return;

      const dtEl = $(el).find("dt");
      dtEl.find("span").remove(); // "New!" ラベルを除去
      const date = dtEl.text().trim();
      const title = $(el).find("dd a").text().trim();
      const href = $(el).find("dd a").attr("href");

      if (!title || !href) return;

      const link = href.startsWith("http") ? href : `${BASE_URL}/${href}`;

      newsItems.push({ date, title, link });
    });

    if (newsItems.length === 0) {
      console.log("⚠️ ニュース一覧のパースに失敗。セレクタの見直しが必要です。");
      process.exit(1);
    }

    console.log(`📰 ${newsItems.length}件のニュースリンクを検出`);

    for (const item of newsItems) {
      console.log(`📄 詳細ページ取得中: ${item.title}`);
      const articleBody = await fetchArticleBody(item.link);

      const content = articleBody.length > 30
        ? `【市公式ニュース】${item.title}\n${articleBody}`
        : `【市公式ニュース】${item.title} (発表日: ${item.date})`;

      // finalizeStoreData 経由で登録（AI enrichment + 品質ゲート）
      // name にタイトルを使用し、各ニュースを独立レコードとして保存
      await finalizeStoreData({
        name: item.title,
        category: "event",
        source: "web",
        sourceUrl: item.link,
        content,
        imageUrl: `${BASE_URL}/images/common/logo.png`,
        postedAt: new Date().toISOString(),
        rawContent: articleBody,
      });
    }
  } catch (err) {
    console.error("❌ ニュース抽出失敗:", err.message);
    process.exit(1);
  }

  console.log("🏁 ニュース収集が完了しました。");
  process.exit(0);
}

collectCityNews();
