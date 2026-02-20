import { getStores } from '@/lib/db';

const SITE_URL = 'https://ushiku-hub.jp';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const stores = await getStores(undefined, 30);

  const items = stores.map((store) => {
    const pubDate = new Date(store.collectedAt).toUTCString();
    const link = store.sourceUrl || SITE_URL;

    return `    <item>
      <title>${escapeXml(store.name)}</title>
      <description>${escapeXml(store.content)}</description>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${store.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(store.category)}</category>
    </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>牛久ナビ</title>
    <link>${SITE_URL}</link>
    <description>牛久市の飲食店・美容室・イベント情報を自動収集・公開</description>
    <language>ja</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
