import { browser } from "openclaw-core";

/**
 * Instagramの投稿から写真と情報を抽出する高度なエージェント
 */
async function scrapeInstagramWithPhotos(targetUrl: string) {
  console.log(`📸 Starting photo extraction for: ${targetUrl}`);

  // 1. ブラウザを起動して投稿ページを開く
  await browser({
    action: "navigate",
    targetUrl: targetUrl
  });

  // 2. ページが読み込まれるのを待つ
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 3. ページのスナップショットを撮って、AIに解析させる（またはJSで直接抜き出す）
  const snapshot = await browser({
    action: "snapshot",
    refs: "aria"
  });

  // 4. 画像URLを抽出するスクリプトを実行
  const result = await browser({
    action: "act",
    request: {
      kind: "evaluate",
      fn: `() => {
        // Instagramの投稿画像を特定する一般的なセレクタ
        const img = document.querySelector('article img[style*="object-fit: cover"]');
        const content = document.querySelector('h1')?.innerText || "";
        return {
          imageUrl: img ? img.src : null,
          content: content
        };
      }`
    }
  });

  console.log("✨ Extracted Data:", result);
  return result;
}
