'use client';

import { useState } from 'react';

/**
 * Instagram投稿をiframeで埋め込み表示する
 * embed.js方式はPortal内やSPA環境で不安定なため、直接iframe方式を採用
 */
export function InstagramEmbed({ url }: { url: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!url) return null;

  // URLからembedパスを生成
  // https://www.instagram.com/p/ABC123/ → https://www.instagram.com/p/ABC123/embed/
  // https://www.instagram.com/reel/ABC123/ → https://www.instagram.com/reel/ABC123/embed/
  const cleanUrl = url.endsWith('/') ? url : `${url}/`;
  const embedUrl = cleanUrl.includes('/embed')
    ? cleanUrl
    : `${cleanUrl}embed/`;

  if (hasError) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full p-6 bg-surface-tertiary rounded-2xl text-center hover:bg-accent-subtle transition-colors"
      >
        <p className="text-sm font-bold text-text-secondary">
          Instagramで投稿を見る →
        </p>
      </a>
    );
  }

  return (
    <div className="w-full flex justify-center rounded-2xl overflow-hidden bg-surface-tertiary relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="p-8 text-center text-text-tertiary text-sm animate-pulse">
            Instagramの投稿を読み込み中...
          </div>
        </div>
      )}
      <iframe
        src={embedUrl}
        className="w-full border-0"
        style={{
          minHeight: isLoaded ? '480px' : '200px',
          maxWidth: '540px',
        }}
        loading="lazy"
        allowTransparency
        allow="encrypted-media"
        title="Instagram投稿"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
