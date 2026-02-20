import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import path from 'path';
// @ts-ignore
const { finalizeStoreData } = require("./data-finalizer");

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const TARGETS = [
  { name: 'NEWSつくば', url: 'https://newstsukuba.jp/?s=%E7%89%9B%E4%B9%85', type: 'news' },
  { name: 'いばナビ (牛久市)', url: 'https://ibanavi.net/shop/list/city/22/', type: 'shop' }
];

/**
 * NEWSつくばの記事本文を取得する
 */
async function fetchArticleText(url: string): Promise<string> {
  try {
    const { data: html } = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(html);
    $('script, style, nav, footer, .ad, .sidebar').remove();
    const text = $('.entry-content').text().trim() || $('article').text().trim();
    return text.replace(/\s+/g, ' ').slice(0, 500);
  } catch {
    return '';
  }
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

async function collect() {
  console.log('🚀 Community Collector starting...');

  for (const target of TARGETS) {
    console.log(`\n--- Fetching from: ${target.name} ---`);
    try {
      const { data: html } = await axios.get(target.url, { timeout: 10000 });
      const $ = cheerio.load(html);

      const candidates: { title: string; sourceUrl: string }[] = [];

      if (target.type === 'news') {
        // NEWSつくば
        $('.entry-title a').each((_, el) => {
          const title = $(el).text().trim();
          const href = $(el).attr('href');
          if (title && href) {
            candidates.push({ title, sourceUrl: href });
          }
        });
      } else if (target.type === 'shop') {
        // いばナビ
        $('a[href]').each((_, el) => {
          const hrefRaw = $(el).attr('href');
          if (!hrefRaw || hrefRaw.includes('/review')) return;
          if (!/\/shop\/\d+/.test(hrefRaw)) return;
          const href = hrefRaw.startsWith('http') ? hrefRaw : `https://ibanavi.net${hrefRaw}`;
          const title = normalizeText($(el).text());
          if (title && title.length > 2 && title.length <= 40) {
            candidates.push({ title, sourceUrl: href });
          }
        });
      }

      // 重複除去
      const seen = new Set<string>();
      const unique = candidates.filter(c => {
        if (seen.has(c.sourceUrl)) return false;
        seen.add(c.sourceUrl);
        return true;
      });

      console.log(`Found ${unique.length} unique candidates (from ${candidates.length} raw).`);

      for (const c of unique.slice(0, 5)) {
        // NEWSつくばは記事本文を取得
        const articleBody = target.type === 'news' ? await fetchArticleText(c.sourceUrl) : '';

        const content = articleBody.length > 30
          ? `${c.title}\n${articleBody}`
          : c.title;

        console.log(`📡 Processing: ${c.title.substring(0, 30)}...`);

        // finalizeStoreData 経由（品質ゲート + AI enrichment）
        await finalizeStoreData({
          name: c.title,
          category: 'other', // AI が後で修正する
          source: 'web',
          sourceUrl: c.sourceUrl,
          content,
          imageUrl: '',
          postedAt: new Date().toISOString(),
          rawContent: articleBody || undefined,
        });
      }

    } catch (e: any) {
      console.error(`Error fetching ${target.name}:`, e.message);
    }
  }

  console.log('\n🏁 Community Collection Finished.');
}

collect();
