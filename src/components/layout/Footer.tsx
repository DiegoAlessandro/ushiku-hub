import { MessageSquarePlus } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-secondary border-t border-border-primary mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-2xl mb-12 flex flex-col gap-4">
            <a
              href="https://forms.gle/your-feedback-form-id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-text-primary text-surface-primary rounded-2xl font-black text-sm hover:bg-accent-primary transition-all shadow-xl active:scale-95 w-full sm:w-auto"
            >
              <MessageSquarePlus size={20} />
              爆速でAIに改善要望を送る
            </a>
            <p className="text-[10px] text-text-tertiary leading-relaxed italic">
              【AI改善宣言】このサイトは住民の声を最短数分で実装に反映します。
            </p>
          </div>

          <div className="max-w-2xl mb-8">
            <p className="text-[10px] text-text-tertiary leading-relaxed text-justify md:text-center">
              【免責事項】当サイト「牛久ナビ」は、AIエージェントを用いてインターネット上の公開情報を自動収集・集約している試験的なポータルサイトです。情報の正確性、最新性、妥当性については細心の注意を払っておりますが、これらを保証するものではありません。掲載情報に基づいた判断や行動により生じた損害等について、当サイトは一切の責任を負いかねます。最新かつ正確な情報は、各店舗・団体の公式サイトやSNSを直接ご確認ください。
            </p>
          </div>

          <p className="text-text-tertiary text-[10px] font-bold uppercase tracking-[0.2em]">
            &copy; 2026 USHIKU HUB
          </p>
        </div>
      </div>
    </footer>
  );
}
