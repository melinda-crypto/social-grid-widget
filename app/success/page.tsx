import Link from 'next/link'

export const metadata = {
  title: 'Purchase Complete | MAI Digital',
  description: 'Thank you for your purchase! Access your Social Grid Widget.',
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7EC8C8] to-[#A8D5BA] rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[#7EC8C8] to-[#A8D5BA] flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            You're in! 🎉
          </h1>
          <p className="text-gray-600">
            Thank you for purchasing Social Grid Widget. Let's get you set up.
          </p>
        </div>

        {/* Main CTA Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#F9D5E5] flex items-center justify-center">
              <span className="text-lg">📖</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Setup Guide</h2>
              <p className="text-sm text-gray-500">5 min setup</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-6">
            Follow our step-by-step guide to connect your widget to Notion. No coding required.
          </p>

          <Link
            href="/setup"
            className="block w-full py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors text-center"
          >
            Start Setup →
          </Link>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <a
            href="#"
            className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#7EC8C8] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#7EC8C8]/20 flex items-center justify-center mb-2 group-hover:bg-[#7EC8C8]/30 transition-colors">
              <span className="text-sm">📋</span>
            </div>
            <p className="font-medium text-gray-900 text-sm">Notion Template</p>
            <p className="text-xs text-gray-400">Duplicate to workspace</p>
          </a>

          <a
            href="https://www.notion.so/my-integrations"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#F5A088] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F5A088]/20 flex items-center justify-center mb-2 group-hover:bg-[#F5A088]/30 transition-colors">
              <span className="text-sm">🔑</span>
            </div>
            <p className="font-medium text-gray-900 text-sm">Create Integration</p>
            <p className="text-xs text-gray-400">Get your API token</p>
          </a>
        </div>

        {/* Receipt Note */}
        <div className="bg-[#F5C242]/10 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-[#F5C242]">📧</span>
            <div>
              <p className="text-sm text-gray-700">
                <strong>Check your email</strong> — We've sent your receipt and these links to your inbox.
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            Need help? Reply to your receipt email.
          </p>
          <p className="text-sm text-gray-400">
            — Mel, MAI Digital 🌼
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
