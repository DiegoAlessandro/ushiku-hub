import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "牛久ナビ - 牛久市のお店情報自動収集サービス",
  description: "InstagramやSNSから牛久市の飲食店・美容室・イベント情報を自動収集・公開",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "牛久ナビ",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// SSRダークモードフラッシュ防止スクリプト
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('ushiku_theme');
    if (t === 'system') t = 'auto';
    var h = new Date().getHours();
    var d = (t === 'dark') || (t !== 'light' && (h < 6 || h >= 18));
    document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
  } catch(e) {}
})();
`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: '牛久ナビ',
      url: 'https://ushiku-hub.jp',
      description: '牛久市の飲食店・美容室・イベント情報を自動収集・公開する地域ポータルサイト',
      inLanguage: 'ja',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://ushiku-hub.jp/?search={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      name: '牛久ナビ',
      url: 'https://ushiku-hub.jp',
      areaServed: {
        '@type': 'City',
        name: '牛久市',
        containedInPlace: { '@type': 'State', name: '茨城県' },
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" type="application/rss+xml" title="牛久ナビ RSS" href="/feed.xml" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
