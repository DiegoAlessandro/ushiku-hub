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
      posted_at, address, phone, instagram_account, is_published, collected_at
    ) VALUES (
      gen_random_uuid(), ${store.name}, ${store.category}, ${store.source}, 
      ${store.sourceUrl}, ${store.content}, ${store.imageUrl}, 
      ${store.postedAt}, ${store.address}, ${store.phone}, 
      ${store.instagramAccount}, true, NOW()
    )
    ON CONFLICT (source_url) DO UPDATE SET
      content = EXCLUDED.content,
      image_url = EXCLUDED.image_url,
      collected_at = NOW()
  `;
}

// 店舗一覧を取得
export async function getStores(
  category?: string,
  limit: number = 50
): Promise<Store[]> {
  const result = category
    ? await sql`
        SELECT * FROM stores 
        WHERE category = ${category} AND is_published = true
        ORDER BY collected_at DESC 
        LIMIT ${limit}
      `
    : await sql`
        SELECT * FROM stores 
        WHERE is_published = true
        ORDER BY collected_at DESC 
        LIMIT ${limit}
      `;
  
  return result as Store[];
}

// 単一店舗取得
export async function getStoreById(id: string): Promise<Store | null> {
  const result = await sql`SELECT * FROM stores WHERE id = ${id}`;
  return (result[0] as Store) || null;
}
