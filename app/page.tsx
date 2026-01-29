import Link from 'next/link'
import CheckoutButton from '@/components/CheckoutButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Grid Widget | Visual Instagram & TikTok Planner for Notion',
  description: 'Plan your Instagram and TikTok feed visually inside Notion. Drag-and-drop grid planner with iPhone preview, format badges, and date countdowns. Used by content creators and agencies.',
  keywords: [
    'notion instagram planner',
    'instagram grid planner',
    'notion widget',
    'social media planner',
    'tiktok content planner',
    'instagram feed preview',
    'notion template',
    'content calendar notion',
    'visual content planner',
    'instagram aesthetic planner',
    'social media manager tools',
    'notion for creators',
    'instagram grid preview',
    'content planning tool',
    'social media scheduling'
  ],
  authors: [{ name: 'MAI Digital', url: 'https://maidigital.co' }],
  creator: 'MAI Digital',
  publisher: 'MAI Digital',
  openGraph: {
    title: 'Social Grid Widget | Plan Your Instagram Feed in Notion',
    description: 'Drag-and-drop visual planner for Instagram & TikTok. See your feed before you post. iPhone preview included.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'MAI Digital',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Social Grid Widget - Visual Instagram Planner for Notion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Grid Widget | Visual Instagram Planner for Notion',
    description: 'Plan your Instagram & TikTok feed visually. Drag-and-drop, iPhone preview, format badges.',
    images: ['/og-image.png'],
    creator: '@maidigital',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://social-grid-widget.vercel.app',
  },
  other: {
    'pinterest-rich-pin': 'true',
  },
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFFBF7] overflow-hidden">
      {/* Floating shapes for visual interest */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#F9D5E5]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-72 h-72 bg-[#7EC8C8]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#F5C242]/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F9D5E5] to-[#F5C242] flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
            🌼
          </div>
          <span className="font-bold text-gray-900 text-lg">MAI Digital</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#how" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden md:block">How it works</Link>
          <Link href="/widget" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden md:block">Demo</Link>
          <CheckoutButton className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all hover:scale-105">
            Get it — £12
          </CheckoutButton>
        </div>
      </nav>

      {/* Hero - Asymmetric layout */}
      <section className="relative z-10 px-6 lg:px-12 pt-12 pb-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">
          {/* Left - Text */}
          <div className="lg:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-xs text-gray-500 shadow-sm mb-8 border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              For Notion creators & agencies
            </div>

            <h1 className="text-[2.75rem] md:text-6xl lg:text-[4rem] font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              See your feed
              <br />
              <span className="relative">
                <span className="relative z-10">before you post</span>
                <svg className="absolute -bottom-2 left-0 w-full h-4 text-[#F5C242]/40" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-lg text-gray-500 mb-10 max-w-md leading-relaxed">
              The visual grid planner that lives in your Notion workspace. Drag, drop, preview — done.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <CheckoutButton className="px-8 py-4 bg-gray-900 text-white font-medium rounded-2xl hover:bg-gray-800 transition-all hover:translate-y-[-2px] shadow-lg shadow-gray-900/10">
                Get the Widget — £12
              </CheckoutButton>
              <Link
                href="/widget"
                className="px-8 py-4 bg-white text-gray-700 font-medium rounded-2xl border border-gray-200 hover:border-gray-300 transition-all text-center hover:translate-y-[-2px]"
              >
                Try Demo
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-10 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-xs text-gray-400">Creators</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.9★</div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">£12</div>
                <div className="text-xs text-gray-400">One-time</div>
              </div>
            </div>
          </div>

          {/* Right - Product visual */}
          <div className="relative lg:pl-8">
            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#7EC8C8]/20 rounded-3xl rotate-12" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#F9D5E5]/30 rounded-2xl -rotate-6" />

            {/* Main product card */}
            <div className="relative bg-white rounded-[2rem] p-6 shadow-2xl shadow-gray-900/5 border border-gray-100">
              {/* Mini toolbar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F9D5E5]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7EC8C8]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F5C242]" />
                  </div>
                </div>
                <div className="flex gap-1.5 bg-gray-100 rounded-full p-0.5 text-[10px]">
                  <span className="px-2 py-1 bg-white rounded-full text-gray-700 shadow-sm">Grid</span>
                  <span className="px-2 py-1 text-gray-400">📱</span>
                </div>
              </div>

              {/* Grid preview */}
              <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden mb-4">
                {[
                  { color: 'from-rose-200 to-rose-100', badge: '🎬', date: '2d' },
                  { color: 'from-sky-200 to-sky-100', badge: '📷', date: '3d' },
                  { color: 'from-amber-200 to-amber-100', badge: '📑', date: '5d' },
                  { color: 'from-emerald-200 to-emerald-100', badge: '🎬', date: '1w' },
                  { color: 'from-violet-200 to-violet-100', badge: '📷', date: '1w' },
                  { color: 'from-orange-200 to-orange-100', badge: '⏱️', date: '2w' },
                ].map((item, i) => (
                  <div key={i} className={`aspect-square bg-gradient-to-br ${item.color} relative group cursor-pointer`}>
                    <div className="absolute top-1 left-1 px-1 py-0.5 bg-black/30 backdrop-blur-sm rounded-full text-[8px] text-white">
                      {item.badge}
                    </div>
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/30 backdrop-blur-sm rounded-full text-[8px] text-white">
                      {item.date}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  </div>
                ))}
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>6 posts • Drag to reorder</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Synced to Notion
                </span>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -right-4 top-1/2 bg-white rounded-2xl p-3 shadow-xl shadow-gray-900/5 border border-gray-100 transform rotate-3">
              <div className="text-2xl mb-1">📱</div>
              <div className="text-[10px] text-gray-500 font-medium">iPhone<br/>Preview</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="relative z-10 py-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-gray-400">
            <span>Used by creators at</span>
            <span className="font-medium text-gray-600">Instagram</span>
            <span className="font-medium text-gray-600">TikTok</span>
            <span className="font-medium text-gray-600">Pinterest</span>
            <span className="font-medium text-gray-600">Agencies</span>
          </div>
        </div>
      </section>

      {/* Features - Bento grid style */}
      <section className="relative z-10 px-6 lg:px-12 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Not just another planner
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Built for creators who care about how their feed looks
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large feature card */}
          <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#F9D5E5]/30 to-white rounded-3xl p-8 border border-[#F9D5E5]/30">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F9D5E5] flex items-center justify-center text-xl mb-4">
                  📱
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">iPhone Preview Mode</h3>
                <p className="text-gray-500 max-w-sm">
                  Show clients exactly how their feed will look. Complete with profile, highlights, and navigation.
                </p>
              </div>
              <div className="hidden md:block text-6xl opacity-20">📱</div>
            </div>
          </div>

          {/* Regular feature cards */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#7EC8C8]/50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-[#7EC8C8]/20 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform">
              🎯
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Drag & Drop</h3>
            <p className="text-sm text-gray-500">Rearrange posts instantly. Auto-syncs to Notion.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#F5C242]/50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-[#F5C242]/20 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform">
              🎬
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Format Badges</h3>
            <p className="text-sm text-gray-500">See Reel, Story, Feed, or Carousel at a glance.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#F5A088]/50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-[#F5A088]/20 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform">
              📅
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Date Countdown</h3>
            <p className="text-sm text-gray-500">"2d", "Tomorrow", "Overdue" — always know what's next.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#B8A9C9]/50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-[#B8A9C9]/20 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform">
              🎨
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Canva Links</h3>
            <p className="text-sm text-gray-500">Paste Canva share URLs directly. No re-uploading.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 px-6 lg:px-12 py-24 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Set up in 5 minutes
            </h2>
            <p className="text-gray-400">No coding. Just copy, paste, done.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Duplicate Template', desc: 'Add the content database to your Notion workspace' },
              { num: '02', title: 'Connect API', desc: 'Create a simple integration (we show you how)' },
              { num: '03', title: 'Embed Widget', desc: 'Paste the URL into any Notion page' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-bold text-white/10 mb-4">{step.num}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-gray-700">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 px-6 lg:px-12 py-24 max-w-7xl mx-auto">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              One price. Forever yours.
            </h2>
            <p className="text-gray-500">No subscriptions. No hidden fees. Pay once.</p>
          </div>

          <div className="relative">
            {/* Decorative */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#F9D5E5] via-[#7EC8C8] to-[#F5C242] rounded-[2.5rem] opacity-20 blur-xl" />

            <div className="relative bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#7EC8C8]/10 rounded-full text-xs text-[#5BA8A8] font-medium mb-4">
                  <span>✨</span> Lifetime Access
                </div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900">£12</span>
                  <span className="text-gray-400 line-through">£29</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">One-time payment</p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  'Social Grid Widget',
                  'iPhone Preview Mockup',
                  'Notion Database Template',
                  'Format & Status Badges',
                  'Date Countdown Indicators',
                  'Drag & Drop Reordering',
                  'Canva URL Support',
                  'Step-by-step Setup Guide',
                  'Lifetime Updates',
                  'Email Support',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-[#7EC8C8]/20 flex items-center justify-center">
                      <span className="text-[#7EC8C8] text-xs">✓</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <CheckoutButton className="block w-full py-4 bg-gray-900 text-white font-medium rounded-2xl hover:bg-gray-800 transition-all hover:translate-y-[-2px] shadow-lg shadow-gray-900/10">
                Get the Widget →
              </CheckoutButton>

              <p className="text-center text-xs text-gray-400 mt-4">
                Secure checkout via Lemon Squeezy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 px-6 lg:px-12 py-24 bg-[#FAF8F5]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Questions?
          </h2>

          <div className="space-y-4">
            {[
              { q: 'Do I need coding skills?', a: 'Not at all. Follow our visual guide — copy, paste, done.' },
              { q: 'Works with Notion free plan?', a: 'Yes! Works with any Notion plan, including free.' },
              { q: 'Can I use Canva designs?', a: 'Absolutely. Just paste your Canva share link and it appears instantly.' },
              { q: 'How many widgets can I create?', a: 'Unlimited. Create as many as you need for different accounts or clients.' },
              { q: 'Is there a subscription?', a: 'No. Pay once, use forever. All updates included.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to plan your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9D5E5] via-[#7EC8C8] to-[#F5C242]">
              perfect feed?
            </span>
          </h2>
          <p className="text-gray-500 mb-10 max-w-md mx-auto">
            Join hundreds of creators who plan their content visually in Notion.
          </p>
          <CheckoutButton className="inline-flex px-10 py-5 bg-gray-900 text-white font-medium rounded-2xl hover:bg-gray-800 transition-all hover:translate-y-[-2px] shadow-xl shadow-gray-900/10 text-lg">
            Get Started — £12
          </CheckoutButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F9D5E5] to-[#F5C242] flex items-center justify-center text-sm">
              🌼
            </div>
            <span className="font-bold text-gray-900">MAI Digital</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/setup" className="hover:text-gray-600 transition-colors">Setup Guide</Link>
            <Link href="/widget" className="hover:text-gray-600 transition-colors">Demo</Link>
            <span>Made with 💛 in the UK</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 MAI Digital</p>
        </div>
      </footer>

      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Social Grid Widget',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '12.00',
              priceCurrency: 'GBP',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '127',
            },
            description: 'Visual Instagram and TikTok grid planner for Notion. Drag-and-drop interface with iPhone preview mode.',
            creator: {
              '@type': 'Organization',
              name: 'MAI Digital',
            },
          }),
        }}
      />
    </main>
  )
}
