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

// 店舗一覧を取得
export async function getStores(
  category?: string,
  limit: number = 50,
  search?: string,
  tag?: string
): Promise<Store[]> {
  let baseQuery = 'SELECT * FROM stores WHERE is_published = true';
  
  if (category) {
    baseQuery += ` AND category = '${category}'`;
  }
  
  if (tag) {
    baseQuery += ` AND '${tag}' = ANY(tags)`;
  }
  
  if (search) {
    baseQuery += ` AND (name ILIKE '%${search}%' OR content ILIKE '%${search}%')`;
  }
  
  baseQuery += ` ORDER BY collected_at DESC LIMIT ${limit}`;
  
  const result = await sql(baseQuery);
  return result as any;
}

// 単一店舗取得
export async function getStoreById(id: string): Promise<Store | null> {
  const result = await sql`SELECT * FROM stores WHERE id = ${id}`;
  return (result[0] as any) || null;
}
