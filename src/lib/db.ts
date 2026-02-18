import { neon } from '@neondatabase/serverless';
import { Store, CollectedData } from '@/types';

// Neon PostgreSQL接続
const sql = neon(process.env.DATABASE_URL!);

export { sql };

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
  // カテゴリ・タグ・検索の有無で分岐（neon tagged templateはパラメータ化済み）
  if (category && tag && search) {
    const result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND category = ${category}
        AND ${tag} = ANY(tags)
        AND (name ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'})
      ORDER BY collected_at DESC LIMIT ${limit}`;
    return result as Store[];
  }
  if (category && tag) {
    const result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND category = ${category}
        AND ${tag} = ANY(tags)
      ORDER BY collected_at DESC LIMIT ${limit}`;
    return result as Store[];
  }
  if (category && search) {
    const result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND category = ${category}
        AND (name ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'})
      ORDER BY collected_at DESC LIMIT ${limit}`;
    return result as Store[];
  }
  if (tag && search) {
    const result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND ${tag} = ANY(tags)
        AND (name ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'})
      ORDER BY collected_at DESC LIMIT ${limit}`;
    return result as Store[];
  }
  if (category) {
    const result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND category = ${category}
      ORDER BY collected_at DESC LIMIT ${limit}`;
    return result as Store[];
  }
  if (tag) {
    const result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND ${tag} = ANY(tags)
      ORDER BY collected_at DESC LIMIT ${limit}`;
    return result as Store[];
  }
  if (search) {
    const result = await sql`
      SELECT * FROM stores WHERE is_published = true
        AND (name ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'})
      ORDER BY collected_at DESC LIMIT ${limit}`;
    return result as Store[];
  }
  const result = await sql`
    SELECT * FROM stores WHERE is_published = true
    ORDER BY collected_at DESC LIMIT ${limit}`;
  return result as Store[];
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
  return (result[0] as Store) ?? null;
}
