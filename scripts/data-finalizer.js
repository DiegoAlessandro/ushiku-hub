const { neon } = require("@neondatabase/serverless");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const { superEnrich } = require("./ai-editor");

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

/**
 * 収集した生のデータをAIで磨き上げ、最終的なニュースとしてDBに登録する
 */
async function finalizeStoreData(data) {
    console.log(`📡 Finalizing data for: ${data.name}`);

    try {
        // 1. まずは仮登録（または重複チェック）
        const existing = await sql`SELECT id FROM stores WHERE source_url = ${data.sourceUrl}`;
        let storeId;

        if (existing.length > 0) {
            storeId = existing[0].id;
            console.log("♻️  Existing store found. Updating...");
        } else {
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

        // 2. AI編集長によるリッチ化（要約・タグ・カテゴリー修正）
        console.log("🧠 AI Editor is working...");
        const enriched = await superEnrich(storeId, data.name, data.content);
        
        console.log(`✨ Successfully finalized: ${data.name} (Category: ${enriched.category})`);
        return true;
    } catch (err) {
        console.error(`❌ Finalization error for ${data.name}:`, err.message);
        return false;
    }
}

module.exports = { finalizeStoreData };
