const { finalizeStoreData } = require("./data-finalizer");

async function runManualFinalization() {
    const dataList = [
        {
            name: "コラティル",
            category: "food",
            source: "instagram",
            sourceUrl: "https://www.instagram.com/tomoko_takeout_ushiku/",
            content: "茨城県牛久市と周辺のグルメ紹介。牛久の飲食店215店舗掲載 of フリーペーパー発行。 #牛久 #牛久市 #牛久グルメ #茨城 #茨城県 #茨城グルメ #ushiku #ibaraki",
            imageUrl: "",
            postedAt: new Date().toISOString()
        },
        {
            name: "ラーメンショップ牛久結束店",
            category: "food",
            source: "instagram",
            sourceUrl: "https://www.instagram.com/ramenshop_ushikukessoku/",
            content: "ラーメンショップ牛久結束店です。店舗についての情報などを発信していきます。年中無休(元旦以外)で10時45分〜23時15分",
            imageUrl: "",
            postedAt: new Date().toISOString()
        },
        {
            name: "牛久シャトーショップ",
            category: "shop",
            source: "instagram",
            sourceUrl: "https://www.instagram.com/ushikuchateaushop/",
            content: "牛久市中央3-20-1 《営業時間》10:00~18:00 《定休日》年末年始。オンライン通販とふるさと納税。",
            imageUrl: "",
            postedAt: new Date().toISOString()
        }
    ];

    console.log("🚀 Starting Manual Finalization...");
    for (const data of dataList) {
        try {
            await finalizeStoreData(data);
        } catch (err) {
            console.error(`Failed to process ${data.name}:`, err);
        }
    }
    console.log("🏁 Manual Finalization Finished.");
}

runManualFinalization();
