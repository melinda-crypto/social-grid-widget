import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">IG Grid Planner Widget</h1>
          <p className="text-gray-600 text-lg">
            Display your Instagram grid inside Notion
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">🚀 Quick Start</h2>
          <ol className="space-y-3 text-gray-700">
            <li>
              <strong>1. Set up your environment variables</strong>
              <ul className="ml-6 mt-2 space-y-1 text-sm">
                <li>• Copy <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> values from Notion Integration</li>
                <li>• Add your <code className="bg-gray-100 px-2 py-1 rounded">NOTION_TOKEN</code></li>
                <li>• Add your <code className="bg-gray-100 px-2 py-1 rounded">NOTION_DATABASE_ID</code></li>
              </ul>
            </li>
            <li>
              <strong>2. Add posts to your Notion database</strong>
              <ul className="ml-6 mt-2 space-y-1 text-sm">
                <li>• Column: <strong>Image URL</strong> (URL property)</li>
                <li>• Column: <strong>Post Link</strong> (URL property)</li>
                <li>• Column: <strong>Caption</strong> (Text property, optional)</li>
              </ul>
            </li>
            <li>
              <strong>3. View your widget</strong>
              <ul className="ml-6 mt-2 space-y-1 text-sm">
                <li>• Visit <Link href="/widget" className="text-blue-600 underline">/widget</Link></li>
              </ul>
            </li>
            <li>
              <strong>4. Embed in Notion</strong>
              <ul className="ml-6 mt-2 space-y-1 text-sm">
                <li>• In Notion, type <code className="bg-gray-100 px-2 py-1 rounded">/embed</code></li>
                <li>• Paste: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000/widget</code></li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">Preview Your Widget</h2>
          <Link
            href="/widget"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            View Widget →
          </Link>
        </div>

        <div className="bg-gray-50 border rounded-lg p-6">
          <h3 className="font-semibold mb-2">📝 Notion Database Structure</h3>
          <p className="text-sm text-gray-600 mb-3">
            Your Notion database should have these columns:
          </p>
          <ul className="space-y-2 text-sm">
            <li>✅ <strong>Image URL</strong> (URL type) - Link to Instagram image</li>
            <li>✅ <strong>Post Link</strong> (URL type) - Link to Instagram post</li>
            <li>✅ <strong>Caption</strong> (Text type) - Optional caption</li>
          </ul>
        </div>

        <div className="text-sm text-gray-500">
          <p>Need help? Check the README.md for detailed instructions.</p>
        </div>
      </div>
    </main>
  )
}
