const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
const { finalizeStoreData } = require("./data-finalizer");

dotenv.config({ path: ".env.local" });

/**
 * 牛久市内の主要な公園・公共施設の魅力をAIでまとめてサイトに流し込む
 */
async function collectFacilityGuides() {
    console.log("🌳 牛久市の公園・施設ガイドの生成を開始...");

    const facilities = [
        {
            name: "牛久自然観察の森",
            category: "event",
            source: "web",
            sourceUrl: "https://www.city.ushiku.lg.jp/page/page000350.html",
            content: "【施設ガイド】広大な里山の中で四季折々の動植物に出会える牛久の宝物。ネイチャーセンターでは木のおもちゃで遊べます。駐車場無料、バリアフリートイレあり。",
            imageUrl: "https://www.city.ushiku.lg.jp/data/img/1410143891_1.jpg",
            postedAt: new Date().toISOString(),
            tags: ["公園", "子連れ歓迎", "無料", "駐車場あり", "自然体験"]
        },
        {
            name: "牛久運動公園",
            category: "event",
            source: "web",
            sourceUrl: "https://www.city.ushiku.lg.jp/page/page000000.html",
            content: "【施設ガイド】本格的なスポーツ施設から、子供が喜ぶ大型遊具まで。広い芝生広場はピクニックに最適です。体育館、プール、テニスコート完備。",
            imageUrl: "https://www.city.ushiku.lg.jp/images/common/logo.png",
            postedAt: new Date().toISOString(),
            tags: ["公園", "大型遊具", "スポーツ", "ピクニック", "駐車場あり"]
        }
    ];

    for (const facility of facilities) {
        await finalizeStoreData(facility);
    }

    console.log("🏁 施設ガイドの生成完了");
    process.exit(0);
}

collectFacilityGuides();
