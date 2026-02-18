const { neon } = require("@neondatabase/serverless");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * 牛久ナビ AI編集長による「まとめ記事」の自動生成
 */
async function generateSummaryArticle(category = 'food', keyword = 'ラーメン') {
    console.log(`✍️  AIキュレーション記事「牛久の${keyword}特集」を作成中...`);

    try {
        // 1. カテゴリーとキーワードに合致する上位店舗をピックアップ
        const stores = await sql`
            SELECT name, content, source_url 
            FROM stores 
            WHERE category = ${category} 
            AND (name ILIKE ${'%' + keyword + '%'} OR content ILIKE ${'%' + keyword + '%'})
            LIMIT 5
        `;

        if (stores.length < 2) {
            console.log("⚠️  データ不足のため記事生成をスキップします。");
            return;
        }

        // 2. AIによるキュレーション
        const prompt = `あなたは牛久市の人気Webメディア「牛久ナビ」のライターです。
        以下の店舗リストを元に、読者が今すぐ行きたくなるような「牛久の${keyword}まとめ記事」を書いてください。
        
        【条件】
        - 読者が親近感を持てる、明るいトーン。
        - 各店舗の魅力をAI視点で1〜2文で紹介。
        - 最後に「牛久ナビで最新情報をチェック！」と結ぶ。
        
        店舗リスト:
        ${stores.map(s => `- ${s.name}: ${s.content}`).join('\n')}
        
        出力は、タイトル(title)と本文(body)を含むJSON形式で。`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const article = JSON.parse(response.choices[0].message.content);
        console.log(`✨ 記事完成: ${article.title}`);

        // 3. 特設ニュースとしてDBに保存（ソースを'AI-Curated'に）
        await sql`
            INSERT INTO stores (
                id, name, category, source, source_url, content, is_published, collected_at
            ) VALUES (
                gen_random_uuid(), ${article.title}, 'event', 'AI-Curated', 
                ${'https://ushiku-hub.jp/articles/' + Date.now()}, ${article.body}, 
                true, NOW()
            )
        `;

        console.log("✅ キュレーション記事を公開しました。");
    } catch (err) {
        console.error("❌ 記事生成エラー:", err.message);
    }
    process.exit(0);
}

// 実行例: ラーメン特集
generateSummaryArticle('food', 'ラーメン');
