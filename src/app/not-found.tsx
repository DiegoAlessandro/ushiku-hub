import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-primary">
      <div className="text-center max-w-md space-y-6">
        <p className="text-8xl font-black text-accent-primary select-none">404</p>
        <h1 className="text-2xl font-black text-text-primary">
          ページが見つかりません
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          お探しのページは移動または削除された可能性があります。
          <br />
          牛久ナビのトップページから最新情報をご覧ください。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-accent-primary text-white rounded-2xl font-bold text-sm hover:bg-accent-primary-hover transition-all shadow-lg"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
