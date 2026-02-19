import { neon } from '@neondatabase/serverless';
import type { Store, CollectedData } from '@/types';

// Neon PostgreSQL接続
const sql = neon(process.env.DATABASE_URL!);

export { sql };

// DBの snake_case カラム → TypeScript camelCase プロパティへの変換
function mapStoreRow(row: Record<string, unknown>): Store {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as Store['category'],
    source: row.source as Store['source'],
    sourceUrl: (row.source_url ?? '') as string,
    content: row.content as string,
    imageUrl: row.image_url as string | undefined,
    imageAlt: row.image_alt as string | undefined,
    postedAt: row.posted_at as Date,
    collectedAt: row.collected_at as Date,
    address: row.address as string | undefined,
    phone: row.phone as string | undefined,
    instagramAccount: row.instagram_account as string | undefined,
    businessHours: row.business_hours as string | undefined,
    regularHoliday: row.regular_holiday as string | undefined,
    latitude: row.latitude as number | undefined,
    longitude: row.longitude as number | undefined,
    tags: (row.tags ?? []) as string[],
    isPublished: row.is_published as boolean,
  };
}

// 店舗情報を保存
export async function saveStore(store: CollectedData): Promise<void> {
  await sql`
    INSERT INTO stores (
      id, name, category, source, source_url, content, image_url,
      posted_at, address, phone, instagram_account,
      business_hours, regular_holiday, latitude, longitude, tags,
      is_published, collected_at
    ) VALUES (
      gen_random_uuid(), ${store.name}, ${store.category}, ${store.source},
      ${store.sourceUrl}, ${store.content}, ${store.imageUrl},
      ${store.postedAt}, ${store.address}, ${store.phone},
      ${store.instagramAccount}, ${store.businessHours}, ${store.regularHoliday},
      ${store.latitude}, ${store.longitude}, ${store.tags || []},
      true, NOW()
    )
    ON CONFLICT (source_url) DO UPDATE SET
      content = EXCLUDED.content,
      image_url = EXCLUDED.image_url,
      business_hours = EXCLUDED.business_hours,
      regular_holiday = EXCLUDED.regular_holiday,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      tags = EXCLUDED.tags,
      collected_at = NOW()
  `;
}

// 店舗一覧を取得（パラメータ化クエリでSQLインジェクション対策）
export async function getStores(
  category?: string,
  limit: number = 50,
  search?: string,
  tag?: string
): Promise<Store[]> {
  let result: Record<string, unknown>[];

  // カテゴリ・タグ・検索の有無で分岐（neon tagged templateはパラメータ化済み）
  if (category && tag && search) {
    result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND category = ${category}
        AND ${tag} = ANY(tags)
        AND (name ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'})
      ORDER BY collected_at DESC LIMIT ${limit}`;
  } else if (category && tag) {
    result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND category = ${category}
        AND ${tag} = ANY(tags)
      ORDER BY collected_at DESC LIMIT ${limit}`;
  } else if (category && search) {
    result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND category = ${category}
        AND (name ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'})
      ORDER BY collected_at DESC LIMIT ${limit}`;
  } else if (tag && search) {
    result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND ${tag} = ANY(tags)
        AND (name ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'})
      ORDER BY collected_at DESC LIMIT ${limit}`;
  } else if (category) {
    result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND category = ${category}
      ORDER BY collected_at DESC LIMIT ${limit}`;
  } else if (tag) {
    result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND ${tag} = ANY(tags)
      ORDER BY collected_at DESC LIMIT ${limit}`;
  } else if (search) {
    result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND (name ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'})
      ORDER BY collected_at DESC LIMIT ${limit}`;
  } else {
    result = await sql`
      SELECT * FROM stores WHERE is_published = true
      ORDER BY collected_at DESC LIMIT ${limit}`;
  }

  return result.map(mapStoreRow);
}

// カテゴリ別件数を集計（全件取得を回避）
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const result = await sql`
    SELECT category, COUNT(*)::int as count
    FROM stores WHERE is_published = true
    GROUP BY category`;
  return (result as Array<{ category: string; count: number }>).reduce(
    (acc, row) => ({ ...acc, [row.category]: row.count }),
    {} as Record<string, number>
  );
}

// 単一店舗取得
export async function getStoreById(id: string): Promise<Store | null> {
  const result = await sql`SELECT * FROM stores WHERE id = ${id}`;
  if (!result[0]) return null;
  return mapStoreRow(result[0] as Record<string, unknown>);
}
