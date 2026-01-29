import { getSocialPosts } from '@/lib/notion'
import SocialGrid from '@/components/SocialGrid'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function WidgetPage() {
  const posts = await getSocialPosts()

  return (
    <main className="min-h-screen bg-white">
      <SocialGrid posts={posts} />
    </main>
  )
}
