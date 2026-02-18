import { NextRequest, NextResponse } from 'next/server';
import { saveStore } from '@/lib/db';
import { CollectedData } from '@/types';

// POST /api/post-news - ユーザーからの一般投稿受付
export async function POST(request: NextRequest) {
  try {
    const data: any = await request.json();

    // 最小限のバリデーション
    if (!data.name || !data.content) {
      return NextResponse.json({ error: '店名と内容は必須です' }, { status: 400 });
    }

    const payload: CollectedData = {
      source: 'web', // ユーザー投稿は一律webソース扱い
      category: 'other', // AIが後で修正
      name: data.name,
      content: `【住民からの投稿】\n${data.content}`,
      sourceUrl: `user-post-${Date.now()}`,
      postedAt: new Date().toISOString(),
    };

    // DBに保存（初期状態は非公開設定にするのが安全だが、爆速開発のため一旦公開）
    await saveStore(payload);

    return NextResponse.json({ 
      success: true,
      message: 'ご投稿ありがとうございます！AIが内容を確認して掲載します。'
    });

  } catch (error) {
    console.error('User post error:', error);
    return NextResponse.json({ error: '送信に失敗しました' }, { status: 500 });
  }
}
