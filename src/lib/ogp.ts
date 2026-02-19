/**
 * OGP画像取得ユーティリティ
 * source_urlからog:imageメタタグを抽出する
 */

const OG_IMAGE_REGEX = /<meta\s+(?:[^>]*?\s)?property=["']og:image["']\s+content=["']([^"']+)["'][^>]*>/i;
const OG_IMAGE_REGEX_REVERSE = /<meta\s+(?:[^>]*?\s)?content=["']([^"']+)["']\s+property=["']og:image["'][^>]*>/i;

const FETCH_TIMEOUT_MS = 5000;

const USER_AGENT =
  'Mozilla/5.0 (compatible; UshikuHubBot/1.0; +https://ushiku-hub.jp)';

// Instagram CDNの画像は署名付き短命URLのため取得しても無意味
const SKIP_DOMAINS = ['instagram.com', 'www.instagram.com'];

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
};

function decodeHtmlEntities(str: string): string {
  return str.replace(/&(?:amp|lt|gt|quot|#39|#x27);/g, (m) => HTML_ENTITIES[m] ?? m);
}

/**
 * URLからOGP画像URLを取得する
 * Instagram URLはスキップ（CDN画像が期限切れするため）
 * @returns 画像URL、取得失敗時はnull
 */
export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const hostname = new URL(url).hostname;
    if (SKIP_DOMAINS.some((d) => hostname === d || hostname.endsWith(`.${d}`))) {
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const html = await response.text();

    const match = html.match(OG_IMAGE_REGEX) ?? html.match(OG_IMAGE_REGEX_REVERSE);
    if (!match?.[1]) return null;

    let imageUrl = decodeHtmlEntities(match[1].trim());

    // 相対URLを絶対URLに変換
    if (imageUrl.startsWith('//')) {
      imageUrl = `https:${imageUrl}`;
    } else if (imageUrl.startsWith('/')) {
      const origin = new URL(url).origin;
      imageUrl = `${origin}${imageUrl}`;
    }

    return imageUrl;
  } catch {
    return null;
  }
}
