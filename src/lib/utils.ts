// 日付フォーマット（日本語表記）
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 相対時刻表示（○分前、○時間前、○日前）
export function formatRelativeTime(date: Date | string): string {
  const now = Date.now();
  const target = new Date(date).getTime();
  const diff = now - target;

  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'たった今';
  if (minutes < 60) return `${minutes}分前`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;

  return formatDate(date);
}

// 営業状態を判定（営業時間文字列 "10:00-19:00" から）
export function getBusinessStatus(businessHours: string | undefined | null): boolean | null {
  if (!businessHours) return null;

  try {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [start, end] = businessHours.split('-');
    if (!start || !end) return null;

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    const startTime = startH * 60 + (startM || 0);
    let endTime = endH * 60 + (endM || 0);

    // 深夜営業対応（例: 18:00-02:00）
    if (endTime < startTime) {
      endTime += 24 * 60;
      if (currentTime < startTime) {
        const adjustedCurrent = currentTime + 24 * 60;
        return adjustedCurrent >= startTime && adjustedCurrent <= endTime;
      }
    }

    return currentTime >= startTime && currentTime <= endTime;
  } catch {
    return null;
  }
}

// Tailwindクラス結合ユーティリティ（clsx的な軽量版）
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}