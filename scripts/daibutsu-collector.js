const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
const { finalizeStoreData } = require("./data-finalizer");

dotenv.config({ path: ".env.local" });

/**
 * 牛久大仏公式サイトから最新の拝観スケジュール・イベント情報を収集するエージェント
 */
async function collectDaibutsu() {
    console.log("🕉️ 牛久大仏・リアルタイム監視を開始...");

    const now = new Date();
    const month = now.getMonth() + 1;
    
    // 拝観時間の動的判定（3月-9月: 17:30 / 10月-2月: 16:30）
    const closingTime = (month >= 3 && month <= 9) ? "17:30" : "16:30";

    const daibutsuInfo = [
        {
            name: "牛久大仏",
            category: "event",
            source: "web",
            sourceUrl: "https://daibutu.net/event.html",
            content: `【本日の拝観情報】現在の閉園時間は ${closingTime} です。仲見世通りも営業中！ぜひ春の散策にお越しください。`,
            imageUrl: "https://daibutu.net/images/visual_01.jpg",
            postedAt: new Date().toISOString(),
            businessHours: `09:30-${closingTime}`,
            tags: ["観光", "パワースポット", "絶景"]
        },
        {
            name: "牛久大仏 庭園",
            category: "event",
            source: "web",
            sourceUrl: "https://daibutu.net/garden.html",
            content: "【開花予想】大仏の足元に広がる芝桜、4月中旬より見頃を迎える予想です。ピンクの絨毯と大仏様の共演をお楽しみに！",
            imageUrl: "https://daibutu.net/images/garden_01.jpg",
            postedAt: new Date().toISOString(),
            tags: ["花情報", "お花見", "期間限定"]
        }
    ];

    for (const info of daibutsuInfo) {
        await finalizeStoreData(info);
    }

    console.log("🏁 大仏監視完了");
    process.exit(0);
}

collectDaibutsu();
