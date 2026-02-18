import { web_search } from "openclaw-core";
// @ts-ignore
const { finalizeStoreData } = require("./data-finalizer");

/**
 * 牛久市内のマルシェ、フリーマーケット、朝市情報を専門に収集するエージェント
 */
async function marcheCollector() {
  console.log("🎪 牛久マルシェ・フリマ情報の特化収集を開始...");

  const queries = [
    "牛久市 マルシェ 開催予定 2026",
    "牛久市 フリーマーケット 最新",
    "うしくWaiwaiマルシェ インスタ",
    "牛久駅前 イベント 開催",
    "牛久市 朝市 農産物直売"
  ];

  for (const query of queries) {
    const results = await web_search({ query, count: 5, search_lang: "jp" });

    for (const result of results.results) {
        console.log(`📡 イベント発見: ${result.title}`);
        
        const rawData = {
            name: result.title.split(' - ')[0].split(' | ')[0],
            category: 'event', // AIが内容を精査して適切ならそのまま
            source: 'web',
            sourceUrl: result.url,
            content: result.description || "イベントの詳細を確認してください",
            imageUrl: "", // 必要に応じて画像抽出
            postedAt: new Date().toISOString()
        };

        // 名寄せとAI要約を経て保存
        await finalizeStoreData(rawData);
    }
  }

  console.log("🏁 マルシェ収集サイクル完了");
}

// integratedCollectorと統合して回す想定
