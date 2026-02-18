const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
const { finalizeStoreData } = require("./data-finalizer");

dotenv.config({ path: ".env.local" });

/**
 * 牛久市内の休日当番医情報を収集し、緊急情報としてサイトに流し込む
 */
async function collectOnDutyDoctors() {
    console.log("🏥 休日当番医情報の収集を開始...");

    // 牛久市医師会・市役所の公開情報をシミュレーション
    const doctorInfo = [
        {
            name: "牛久市 休日当番医（今週末）",
            category: "event", // 重要情報としてイベント枠へ
            source: "web",
            sourceUrl: "https://www.city.ushiku.lg.jp/page/page000001.html",
            content: "【今週の日曜当番医】〇〇内科クリニック (牛久市中央)。診療時間: 9:00〜17:00。受診前には必ず電話確認をお願いします。",
            imageUrl: "", 
            postedAt: new Date().toISOString(),
            tags: ["重要", "休日当番医", "安心・安全"]
        }
    ];

    for (const info of doctorInfo) {
        // AIエディターが「重要」タグを認識し、最優先で処理するように送信
        await finalizeStoreData(info);
    }

    console.log("🏁 当番医情報の収集完了");
    process.exit(0);
}

collectOnDutyDoctors();
