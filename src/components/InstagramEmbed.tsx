'use client';

import { useEffect } from 'react';

/**
 * Instagramの埋め込みスクリプトを安全にロードし、投稿を表示する
 */
export function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    if (!url) return;
    // @ts-ignore
    if (window.instgrm) {
      // @ts-ignore
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [url]);

  if (!url) return null;

  // InstagramのURLを埋め込み用フォーマットに変換
  const embedUrl = url.endsWith('/') ? url : `${url}/`;

  return (
    <div className="w-full flex justify-center bg-slate-50 rounded-xl overflow-hidden min-h-[400px]">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={embedUrl}
        data-instgrm-version="14"
        style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}
      >
        <div className="p-8 text-center text-slate-400 text-sm animate-pulse">
          Instagramの投稿を読み込み中...
        </div>
      </blockquote>
    </div>
  );
}
