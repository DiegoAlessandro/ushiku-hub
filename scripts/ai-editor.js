const { neon } = require("@neondatabase/serverless");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ENHANCED_AI_PROMPT = `あなたは牛久市の地域ポータル「牛久ナビ」のAI編集長です。
提供された情報を分析し、住民の生活を豊かにする最高品質の地域ニュースに書き換えてください。

【タスク1: カテゴリーの厳密な分類】
内容を読み、以下のいずれかに分類してください。
- food: 飲食店、カフェ、弁当
- beauty: 美容室、ネイル、エステ
- shop: 小売店、スーパー、ドラッグストア
- education: 習い事、塾、スポーツ教室、スクール
- jobs: 求人、アルバイト、パート募集
- event: お祭り、市役所のニュース、イベント、観光案内
- other: その他

【タスク2: 属性タグの抽出（超重要）】
内容から、住民が検索しそうな属性を抽出してください（エリア、テイクアウト、対象年齢など）。

【タスク3: 最強の要約（市民メリット優先）】
1. 【一言でいうと】: 30文字以内。メリット冒頭。
2. 【詳細】: 100文字以内。具体的。

【タスク4: 画像の言語化 (Vision代行)】
画像URLが提供されている場合、その画像の内容を簡潔に（50文字以内）説明してください。
例: 「牛久駅前のラーメン店で提供されている特製醤油ラーメンのアップ写真」

出力は必ず以下のJSON形式にしてください：
{
  "category": "food",
  "tags": [],
  "summary": "",
  "imageAlt": "画像の説明文"
}`;

async function superEnrich(id, name, content, imageUrl = null) {
    console.log(`🧠 AI Enriching (Task #23 Vision): ${name}`);
    
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Vision対応モデル
            messages: [
                { role: "system", content: ENHANCED_AI_PROMPT },
                { role: "user", content: `店名: ${name}\n内容: ${content}${imageUrl ? `\n画像URL: ${imageUrl}` : ''}` },
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(response.choices[0].message.content);
        
        await sql`
          UPDATE stores 
          SET 
            category = ${result.category},
            content = ${result.summary},
            tags = ${result.tags},
            image_alt = ${result.imageAlt},
            collected_at = NOW() 
          WHERE id = ${id}
        `;
        
        return result;
    } catch (e) {
        console.error("SuperEnrich Error:", e.message);
        return null;
    }
}

module.exports = { superEnrich };
