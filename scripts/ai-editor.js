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
内容から、住民が検索しそうな以下の属性を**必ず**抽出して配列に入れてください。
- エリア判定: 「牛久駅エリア」「ひたち野うしく駅エリア」 (住所や店名から推測)
- 飲食店: 「テイクアウト可」「デリバリー可」「夜22時以降営業」「ランチあり」「禁煙」「個室あり」
- 習い事: 「幼児向け」「小学生向け」「中高生向け」「大人向け」「無料体験あり」
- 共通: 「新メニュー」「クーポン」「臨時休業」「セール」「開店」「閉店」「駐車場あり」「キャッシュレス対応」「アルバイト募集」

【タスク3: 最強の要約（市民メリット優先）】
読者が一瞬で「自分に関係がある！」「お得だ！」と思えるコピーを作成してください。
1. 【一言でいうと】: 30文字以内。冒頭に必ず具体的なメリット（【無料】【半額】【新店】【駅近】等）を入れ、地名や店名を含めてキャッチーに。
2. 【詳細】: 100文字以内。住民が「いつ、どこで、何をすべきか」が分かるように具体的に。
3. 【ハッシュタグ】: 牛久に関連するタグを3つ。

出力は必ず以下のJSON形式にしてください：
{
  "category": "food",
  "tags": ["テイクアウト可", "駐車場あり", "新メニュー"],
  "summary": "【一言でいうと】\\n...\\n\\n【詳細】\\n...\\n\\n【ハッシュタグ】\\n#牛久市 #..."
}`;

async function superEnrich(id, name, content) {
    console.log(`🧠 AI Enriching (Task #3/#4): ${name}`);
    
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: ENHANCED_AI_PROMPT },
                { role: "user", content: `店名/組織名: ${name}\n内容: ${content}` },
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(response.choices[0].message.content);
        
        // DB更新（タグの自動付与を含む）
        await sql`
          UPDATE stores 
          SET 
            category = ${result.category},
            content = ${result.summary},
            tags = ${result.tags},
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
