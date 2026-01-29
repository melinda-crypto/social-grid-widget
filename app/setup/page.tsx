import Link from 'next/link'

export const metadata = {
  title: 'Setup Guide | Social Grid Widget | MAI Digital',
  description: 'Step-by-step guide to set up your Social Grid Widget in Notion.',
}

const NOTION_TEMPLATE_URL = process.env.NEXT_PUBLIC_NOTION_TEMPLATE_URL || 'https://maidigital.notion.site/Social-Grid-Template'
const WIDGET_BASE_URL = process.env.NEXT_PUBLIC_WIDGET_URL || 'https://social-grid-widget.vercel.app'

export default function SetupGuidePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌼</span>
            <span className="font-bold text-gray-800">MAI Digital</span>
          </Link>
          <span className="text-sm text-gray-400">Setup Guide</span>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#7EC8C8]/20 rounded-full text-sm text-[#5BA8A8] mb-4">
            <span>📖</span>
            <span>Setup Guide</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Let's get your widget set up
          </h1>
          <p className="text-gray-600">
            Follow these steps to connect your Social Grid Widget to Notion. Takes about 5 minutes.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F5A088] to-[#F5C242] text-white text-sm font-bold flex items-center justify-center">
                {step}
              </div>
              {step < 4 && <div className="w-8 h-0.5 bg-gray-200"></div>}
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-8">

          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#F9D5E5] text-[#E88B8B] font-bold flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Duplicate the Notion Template</h2>
                <p className="text-gray-600 text-sm">Add the content planner database to your workspace</p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] rounded-xl p-6 mb-6">
              <p className="text-gray-700 mb-4">Click the button below to open the template, then click <strong>"Duplicate"</strong> in the top right corner.</p>
              <a
                href={NOTION_TEMPLATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h10v2H6v12h12v-8h2v10H4V4zm12 0h4v4h-2V6.414l-7.293 7.293-1.414-1.414L16.586 6H14V4z"/>
                </svg>
                Open Notion Template
              </a>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-500 bg-[#7EC8C8]/10 rounded-lg p-4">
              <span className="text-[#7EC8C8]">💡</span>
              <p>The template includes sample posts. Feel free to delete them after setup.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#7EC8C8] text-white font-bold flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Create a Notion Integration</h2>
                <p className="text-gray-600 text-sm">Generate an API token to connect the widget</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">a</span>
                <div>
                  <p className="text-gray-700">Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-[#7EC8C8] underline font-medium">notion.so/my-integrations</a></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">b</span>
                <div>
                  <p className="text-gray-700">Click <strong>"New integration"</strong></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">c</span>
                <div>
                  <p className="text-gray-700">Name it <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">Social Grid Widget</code></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">d</span>
                <div>
                  <p className="text-gray-700">Select your workspace and click <strong>"Submit"</strong></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">e</span>
                <div>
                  <p className="text-gray-700">Copy the <strong>"Internal Integration Secret"</strong> (starts with <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">ntn_</code>)</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F5A088]/10 rounded-lg p-4">
              <p className="text-sm text-gray-600"><span className="font-medium text-[#F5A088]">⚠️ Keep this secret safe!</span> Don't share it publicly. You'll need it in Step 4.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#F5C242] text-white font-bold flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Connect Integration to Database</h2>
                <p className="text-gray-600 text-sm">Give the widget permission to read your posts</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">a</span>
                <p className="text-gray-700">Open the duplicated template in Notion</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">b</span>
                <p className="text-gray-700">Click the <strong>•••</strong> menu in the top right</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">c</span>
                <p className="text-gray-700">Click <strong>"Connections"</strong> → <strong>"Connect to"</strong></p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">d</span>
                <p className="text-gray-700">Search for <strong>"Social Grid Widget"</strong> and select it</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-500 bg-[#7EC8C8]/10 rounded-lg p-4">
              <span className="text-[#7EC8C8]">💡</span>
              <p>You should see a green checkmark once connected successfully.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#F5A088] text-white font-bold flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Get Your Database ID</h2>
                <p className="text-gray-600 text-sm">Find the unique ID for your content database</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">a</span>
                <p className="text-gray-700">Open your database in Notion as a <strong>full page</strong></p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">b</span>
                <p className="text-gray-700">Copy the URL from your browser</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">c</span>
                <div>
                  <p className="text-gray-700 mb-2">The database ID is the part after your workspace name:</p>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <span className="text-gray-500">notion.so/yourworkspace/</span><span className="text-[#7EC8C8]">c1e571b9229f42989c231607b40ee1dd</span><span className="text-gray-500">?v=...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 - Embed */}
          <div className="bg-gradient-to-br from-[#F9D5E5]/30 via-[#7EC8C8]/20 to-[#F5C242]/30 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F5A088] to-[#F5C242] text-white font-bold flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Embed Your Widget</h2>
                <p className="text-gray-600 text-sm">Add the widget to any Notion page</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6">
              <p className="text-gray-700 mb-4">Your personal widget URL:</p>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm break-all mb-4">
                <span className="text-[#7EC8C8]">{WIDGET_BASE_URL}</span><span className="text-gray-400">/widget?token=</span><span className="text-[#F9D5E5]">YOUR_TOKEN</span><span className="text-gray-400">&db=</span><span className="text-[#F5C242]">YOUR_DATABASE_ID</span>
              </div>
              <p className="text-sm text-gray-500">Replace <span className="text-[#F9D5E5]">YOUR_TOKEN</span> with your integration secret and <span className="text-[#F5C242]">YOUR_DATABASE_ID</span> with your database ID.</p>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-gray-700 font-medium">To embed in Notion:</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                <li>Type <code className="bg-white px-2 py-0.5 rounded">/embed</code> in Notion</li>
                <li>Paste your widget URL</li>
                <li>Resize the embed to fit your layout</li>
              </ol>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-600 bg-white rounded-lg p-4">
              <span className="text-[#F5C242]">🎉</span>
              <p><strong>You're all set!</strong> Your widget will now show your upcoming posts in a beautiful grid.</p>
            </div>
          </div>

        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Need help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Reply to your purchase receipt email and I'll personally help you get set up.
            </p>
            <p className="text-sm text-gray-400">
              — Mel, MAI Digital 🌼
            </p>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100 mt-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl">🌼</span>
            <span className="font-bold text-gray-800">MAI Digital</span>
          </div>
          <p className="text-gray-400 text-sm">Made with 💛 for content creators</p>
        </div>
      </footer>
    </main>
  )
}
