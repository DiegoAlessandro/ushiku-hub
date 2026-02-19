import { NextRequest, NextResponse } from 'next/server';
import { saveStore } from '@/lib/db';
import { fetchOgImage } from '@/lib/ogp';
import { CollectedData } from '@/types';

// POST /api/collect - データ収集エンドポイント
export async function POST(request: NextRequest) {
  try {
    // APIキーチェック
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: CollectedData = await request.json();

    // バリデーション
    if (!data.name || !data.content || !data.source) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // imageUrlが未設定の場合、OGPから自動取得
    if (!data.imageUrl && data.sourceUrl) {
      const ogImage = await fetchOgImage(data.sourceUrl);
      if (ogImage) {
        data.imageUrl = ogImage;
      }
    }

    // DBに保存
    await saveStore(data);

    return NextResponse.json({ 
      success: true,
      message: `Store "${data.name}" collected successfully`
    });

  } catch (error) {
    console.error('Collection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/collect - テスト用
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Ushiku Hub Collector API is running'
  });
}
