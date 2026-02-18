const { neon } = require("@neondatabase/serverless");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * 週末に向けた「今週末の牛久お出かけガイド」を自動生成する
 */
async function generateWeekendGuide() {
    console.log("📝 今週末の牛久ガイドを執筆中...");

    try {
        // 1. 直近1週間の全データを取得
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const recentStores = await sql`
            SELECT name, category, content, tags 
            FROM stores 
            WHERE collected_at > ${lastWeek}
            AND is_published = true
        `;

        if (recentStores.length === 0) {
            console.log("⚠️  最近のデータが足りないため、ガイド生成を待機します。");
            return;
        }

        // 2. AIによる週末お出かけ提案の作成
        const prompt = `あなたは牛久市の超人気ポータル「牛久ナビ」のカリスマ編集長です。
        以下の「今週の牛久の新着情報リスト」を読み、住民が週末にワクワクして出かけたくなるような【今週末の牛久・お出かけガイド】を書いてください。
        
        【執筆ルール】
        - 「今週末はここに行こう！」という力強い見出し。
        - 家族向け、グルメ好き向け、癒やし向けなど、目的別に店やイベントを分類。
        - 住民に親しみやすい、温かい語り口。
        
        今週のリスト:
        ${recentStores.map(s => `- [${s.category}] ${s.name}: ${s.content} (タグ: ${s.tags.join(',')})`).join('\n')}
        
        出力は、タイトル(title)と本文(body)を含むJSON形式で。`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const article = JSON.parse(response.choices[0].message.content);
        console.log(`✨ 週末ガイド完成: ${article.title}`);

        // 3. 特別枠として保存（sourceを'WEEKEND-GUIDE'に。最優先表示）
        await sql`
            INSERT INTO stores (
                id, name, category, source, source_url, content, is_published, collected_at, tags
            ) VALUES (
                gen_random_uuid(), ${article.title}, 'event', 'WEEKEND-GUIDE', 
                ${'https://ushiku-hub.jp/guides/' + Date.now()}, ${article.body}, 
                true, NOW(), ARRAY['週末ガイド', 'お出かけ']
            )
        `;

        console.log("✅ 週末ガイドをトップページに配信しました！");
    } catch (err) {
        console.error("❌ 週末ガイド生成エラー:", err.message);
    }
    process.exit(0);
}

generateWeekendGuide();
