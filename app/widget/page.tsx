import { getSocialPosts } from '@/lib/notion'
import SocialGrid from '@/components/SocialGrid'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// oEmbed-style metadata to help Notion understand the embed
export const metadata: Metadata = {
  title: 'Instagram Grid Planner',
  description: 'Plan your Instagram feed visually',
  other: {
    'og:type': 'website',
    'og:title': 'Instagram Grid Planner',
    'og:description': 'Plan your Instagram feed visually',
  },
}

export default async function WidgetPage() {
  const posts = await getSocialPosts()

  return (
    <main className="min-h-screen bg-white">
      <SocialGrid posts={posts} />
    </main>
  )
}
