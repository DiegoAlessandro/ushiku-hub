const { neon } = require("@neondatabase/serverless");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SUMMARY_PROMPT = `あなたは牛久市の地域情報ガイドです。
SNSの投稿内容を読み、以下のルールで「街の人が読みたくなる要約」を作成してください。

1. 【一言でいうと】: 30文字以内で、その情報の最も重要な価値（新メニュー、セール、イベント開催など）を伝える。
2. 【詳細】: 100文字以内で、日時、場所、価格などの具体的なメリットをまとめる。
3. 【ハッシュタグ】: 牛久に関連するタグを3つ。

出力は必ず以下のJSON形式にしてください：
{
  "summary": "【一言でいうと】\\n...\\n\\n【詳細】\\n...\\n\\n【ハッシュタグ】\\n#牛久市 #..."
}`;

async function enrichStoreData() {
  console.log("🧠 AIによる情報クオリティ向上（要約生成）を開始...");

  try {
    // 要約がまだない（または古い形式）のデータを取得
    const stores = await sql`
      SELECT id, name, content 
      FROM stores 
      WHERE content NOT LIKE '%【一言でいうと】%'
      LIMIT 10
    `;

    console.log(`📊 対象データ: ${stores.length}件`);

    for (const store of stores) {
      console.log(`✨ Processing: ${store.name}`);

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SUMMARY_PROMPT },
          { role: "user", content: `店名/組織名: ${store.name}\n投稿内容: ${store.content}` },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      // DB更新
      await sql`
        UPDATE stores 
        SET content = ${result.summary}, collected_at = NOW() 
        WHERE id = ${store.id}
      `;
      
      console.log(`✅ ${store.name} の要約を保存しました。`);
    }

    console.log("🏁 AI要約バッチ完了");
  } catch (err) {
    console.error("❌ AI要約エラー:", err.message);
  }
  process.exit(0);
}

enrichStoreData();
