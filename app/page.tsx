import Link from 'next/link'

export const metadata = {
  title: 'Social Grid Widget for Notion | MAI Digital',
  description: 'Plan your Instagram & TikTok feed visually in Notion. Drag-and-drop grid planner that syncs with your database. Preview your content before posting.',
  keywords: 'notion widget, instagram grid planner, tiktok planner, social media planner, notion template, content calendar, instagram preview, feed planner, notion integration',
  openGraph: {
    title: 'Social Grid Widget for Notion | MAI Digital',
    description: 'Plan your Instagram & TikTok feed visually in Notion. Drag-and-drop grid planner.',
    type: 'website',
  },
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌼</span>
          <span className="font-bold text-gray-800">MAI Digital</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 hidden md:block">Features</Link>
          <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 hidden md:block">Pricing</Link>
          <Link href="#setup" className="text-sm text-gray-600 hover:text-gray-900 hidden md:block">Setup</Link>
          <Link
            href="#pricing"
            className="px-4 py-2 bg-gradient-to-r from-[#F5A088] to-[#F5C242] text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            Get Widget
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F9D5E5]/50 rounded-full text-sm text-[#E88B8B] mb-6">
          <span>✨</span>
          <span>For Notion creators & social media managers</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A088] to-[#7EC8C8]">Instagram & TikTok</span>
          <br />Feed in Notion
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          See exactly how your feed will look before you post. Drag, drop, and rearrange your content — all synced with your Notion database.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="#pricing"
            className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Get the Widget — $12
          </Link>
          <Link
            href="/widget"
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-medium rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
          >
            See Demo →
          </Link>
        </div>

        {/* Product Preview */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F9D5E5] via-[#7EC8C8] to-[#F5C242] rounded-3xl blur-3xl opacity-30"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Grid Preview</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-[#F9D5E5]"></div>
                <div className="w-3 h-3 rounded-full bg-[#7EC8C8]"></div>
                <div className="w-3 h-3 rounded-full bg-[#F5C242]"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
              {[1,2,3,4,5,6,7,8,9].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">Drag to reorder • Syncs to Notion</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything you need to plan your feed
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-xl mx-auto">
            No more guessing. See your content exactly as your followers will.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Drag & Drop', description: 'Rearrange posts instantly. Changes sync automatically to your Notion database.', color: '#F9D5E5' },
              { icon: '📱', title: 'Multi-Platform', description: 'Plan Instagram and TikTok content in one place. Filter by platform anytime.', color: '#7EC8C8' },
              { icon: '🎨', title: 'Canva Integration', description: 'Paste Canva share links directly. No need to re-upload your designs.', color: '#F5C242' },
              { icon: '📅', title: 'Sort by Date', description: 'Toggle between manual order or sort by publish date from Notion.', color: '#F5A088' },
              { icon: '🔄', title: 'Real-time Sync', description: 'Widget connects directly to your Notion database. Always up to date.', color: '#B8A9C9' },
              { icon: '✨', title: 'Clean & Minimal', description: 'Beautiful grid preview that looks just like the real Instagram feed.', color: '#A8D5BA' }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ backgroundColor: `${feature.color}40` }}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="setup" className="px-6 py-20 bg-[#FAF8F5]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Set up in 5 minutes</h2>
          <p className="text-center text-gray-600 mb-12">No coding required. Just copy, paste, and you're ready.</p>

          <div className="space-y-6">
            {[
              { step: '1', title: 'Duplicate the Notion template', description: 'Click the button and add the content planner database to your workspace.' },
              { step: '2', title: 'Create a Notion integration', description: 'Generate an API token and connect it to your database. We provide step-by-step instructions.' },
              { step: '3', title: 'Add your widget URL', description: 'Embed the widget in your Notion page and start planning your beautiful feed!' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start bg-white p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F5A088] to-[#F5C242] text-white font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 bg-white">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, one-time pricing</h2>
          <p className="text-gray-600 mb-10">Pay once, use forever. No subscriptions.</p>

          <div className="bg-gradient-to-br from-[#FAF8F5] to-white rounded-3xl p-8 border border-gray-100 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#7EC8C8]/20 rounded-full text-sm text-[#5BA8A8] mb-6">
              <span>🌟</span>
              <span>Most Popular</span>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-bold text-gray-900">$12</span>
              <span className="text-gray-500 ml-2">one-time</span>
            </div>

            <ul className="text-left space-y-3 mb-8">
              {[
                'Social Grid Widget',
                'Notion Database Template',
                'Step-by-step Setup Guide',
                'Instagram & TikTok Support',
                'Drag & Drop Reordering',
                'Canva URL Integration',
                'Lifetime Updates',
                'Email Support'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                  <span className="text-[#7EC8C8]">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="https://maidigital.gumroad.com/l/social-grid-widget"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              Get the Widget →
            </a>

            <p className="text-xs text-gray-400 mt-4">Secure checkout via Gumroad</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 bg-[#FAF8F5]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Questions? We've got answers</h2>

          <div className="space-y-4">
            {[
              { q: 'Do I need coding skills?', a: 'Nope! Just follow our simple setup guide. Copy, paste, done.' },
              { q: 'Does it work with Notion free plan?', a: 'Yes! The widget works with any Notion plan, including free.' },
              { q: 'Can I use images from Canva?', a: 'Absolutely! Just paste your Canva share link and it shows up instantly.' },
              { q: 'How many widgets can I create?', a: 'Unlimited! Create as many as you need for different accounts or clients.' },
              { q: 'Is there a subscription?', a: 'No subscriptions. Pay once, use forever with free lifetime updates.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-gradient-to-r from-[#F9D5E5] via-[#7EC8C8] to-[#F5C242]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to plan your perfect feed?</h2>
          <p className="text-white/80 mb-8">Join hundreds of creators using Social Grid Widget</p>
          <a
            href="https://maidigital.gumroad.com/l/social-grid-widget"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            Get Started — $12
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">🌼</span>
          <span className="font-bold text-white">MAI Digital</span>
        </div>
        <p className="text-gray-400 text-sm">Made with 💛 for content creators</p>
        <p className="text-gray-500 text-xs mt-4">© 2026 MAI Digital. All rights reserved.</p>
      </footer>
    </main>
  )
}
