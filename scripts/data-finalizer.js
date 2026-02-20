const { neon } = require("@neondatabase/serverless");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const { superEnrich } = require("./ai-editor");

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

/** OpenAI クライアント（遅延初期化） */
let _openai = null;
function getOpenAI() {
    if (!_openai) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY が設定されていません。.env.local を確認してください。");
        }
        _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return _openai;
}

/**
 * AIによる店名の名寄せ（同一店舗判定）
 */
async function findExistingStore(newName) {
    const stores = await sql`SELECT id, name FROM stores ORDER BY collected_at DESC LIMIT 100`;

    if (stores.length === 0) return null;

    const prompt = `以下の店舗リストの中に、「${newName}」と同じ、あるいは極めて関連性の高い（支店違い、表記揺れなど）店舗はありますか？
    ある場合はそのIDを、ない場合は "null" とだけ回答してください。

    リスト:
    ${stores.map(s => `ID: ${s.id}, Name: ${s.name}`).join('\n')}

    JSON形式で回答: {"matchId": "UUID or null"}`;

    const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.matchId === "null" ? null : result.matchId;
}

/**
 * 収集した生のデータをAIで磨き上げ、最終的なニュースとしてDBに登録する
 */
async function finalizeStoreData(data) {
    console.log(`📡 Finalizing data for: ${data.name}`);

    try {
        // 1. URLによる完全一致チェック
        const urlMatch = await sql`SELECT id FROM stores WHERE source_url = ${data.sourceUrl}`;
        let storeId;

        if (urlMatch.length > 0) {
            storeId = urlMatch[0].id;
            console.log("♻️  URL match found. Updating existing record...");
            // 既存レコードの content を更新
            await sql`
                UPDATE stores
                SET content = ${data.content}, collected_at = NOW()
                WHERE id = ${storeId}
            `;
        } else {
            // 2. AIによる店名の名寄せチェック (Task #11)
            const aiMatchId = await findExistingStore(data.name);

            if (aiMatchId) {
                storeId = aiMatchId;
                console.log(`🤝 AI matched with existing store ID: ${aiMatchId}. Merging information...`);
            } else {
                // 3. 新規作成
                const result = await sql`
                    INSERT INTO stores (
                        id, name, category, source, source_url, content, image_url, posted_at, is_published, collected_at
                    ) VALUES (
                        gen_random_uuid(), ${data.name}, ${data.category}, ${data.source},
                        ${data.sourceUrl}, ${data.content}, ${data.imageUrl}, ${data.postedAt}, true, NOW()
                    ) RETURNING id
                `;
                storeId = result[0].id;
                console.log("🆕 New store created.");
            }
        }

        // AI編集長によるリッチ化（rawContent も渡す）
        console.log("🧠 AI Editor is working...");
        const enriched = await superEnrich(
            storeId,
            data.name,
            data.content,
            data.imageUrl,
            data.rawContent || null
        );

        if (!enriched) {
            console.warn(`⚠️ AI enrichment failed for: ${data.name}`);
            return false;
        }

        // 品質ゲート: publishable === false なら非公開にする
        if (enriched.publishable === false) {
            await sql`
                UPDATE stores SET is_published = false WHERE id = ${storeId}
            `;
            console.warn(`⚠️ 品質不足のため非公開: ${data.name} (qualityScore: ${enriched.qualityScore})`);
        } else {
            console.log(`✨ Successfully finalized: ${data.name} (Category: ${enriched.category}, Quality: ${enriched.qualityScore})`);
        }

        return true;
    } catch (err) {
        console.error(`❌ Finalization error for ${data.name}:`, err.message);
        return false;
    }
}

module.exports = { finalizeStoreData };
