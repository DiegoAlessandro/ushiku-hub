const { neon } = require("@neondatabase/serverless");
const OpenAI = require("openai");
const dotenv = require("dotenv");

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

⚠️ 品質ルール（厳守）:
- 本文の根拠がない内容は絶対に書かない。推測や一般論で埋めない。
- 「公式情報サイトで～を紹介」のような空虚な要約は禁止。具体的な事実のみ書くこと。
- 本文が50文字未満で具体的な情報（日時、場所、内容）がない場合、publishable: false を返すこと。

【タスク4: 画像の言語化 (Vision代行)】
画像URLが提供されている場合、その画像の内容を簡潔に（50文字以内）説明してください。
例: 「牛久駅前のラーメン店で提供されている特製醤油ラーメンのアップ写真」

【タスク5: 品質判定】
以下の基準で品質を判定してください:
- qualityScore: 1-5 の整数。5が最高品質。
  - 5: 日時・場所・内容すべて具体的
  - 4: 主要情報あり、一部不明確
  - 3: 最低限の情報あり
  - 2: 情報が薄い、曖昧
  - 1: ほぼ情報なし
- publishable: true/false。qualityScore が 2以下、または具体情報がない場合は false。

出力は必ず以下のJSON形式にしてください：
{
  "category": "food",
  "tags": [],
  "summary": "",
  "imageAlt": "画像の説明文",
  "publishable": true,
  "qualityScore": 4
}`;

async function superEnrich(id, name, content, imageUrl = null, rawContent = null) {
    console.log(`🧠 AI Enriching (Task #23 Vision): ${name}`);

    try {
        // 入力テキストを構成（rawContent があれば本文全体も渡す）
        let userMessage = `店名: ${name}\n内容: ${content}`;
        if (rawContent && rawContent.length > 0) {
            userMessage += `\n元の本文: ${rawContent}`;
        }
        if (imageUrl) {
            userMessage += `\n画像URL: ${imageUrl}`;
        }

        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: ENHANCED_AI_PROMPT },
                { role: "user", content: userMessage },
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(response.choices[0].message.content);

        // summary がオブジェクト（一言+詳細）の場合はテキストに変換
        if (typeof result.summary === "object" && result.summary !== null) {
            const parts = Object.values(result.summary).filter(Boolean);
            result.summary = parts.join(" ");
        }

        // publishable のデフォルト: 未設定なら true とみなす（後方互換）
        if (result.publishable === undefined) {
            result.publishable = true;
        }
        if (result.qualityScore === undefined) {
            result.qualityScore = 3;
        }

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
