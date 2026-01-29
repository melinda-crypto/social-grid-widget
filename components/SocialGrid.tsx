'use client'

import { SocialPost } from '@/lib/notion'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SocialGridProps {
  posts: SocialPost[]
}

const statusColors = {
  Draft: 'bg-gray-500',
  Ready: 'bg-yellow-500',
  Scheduled: 'bg-blue-500',
  Posted: 'bg-green-500',
}

const statusIcons = {
  Draft: '✏️',
  Ready: '✅',
  Scheduled: '📅',
  Posted: '🚀',
}

const platformIcons = {
  Instagram: '📸',
  TikTok: '🎵',
}

const platformColors = {
  Instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  TikTok: 'bg-black',
}

export default function SocialGrid({ posts }: SocialGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    router.refresh()
    // Reset the spinning state after animation
    setTimeout(() => setIsRefreshing(false), 1000)
  }, [router])

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 gap-4">
        <p>No posts found. Add posts to your Notion database.</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
        >
          🔄 Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          {posts.length} posts
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-full text-sm font-medium transition-all"
        >
          <span className={`inline-block ${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
          Reset
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 transition-transform hover:scale-[1.02] cursor-pointer"
            onMouseEnter={() => setHoveredId(post.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img
              src={post.imageUrl}
              alt={post.caption || post.name || 'Social media post'}
              className="w-full h-full object-cover"
            />

            {/* Platform badge */}
            {post.platform && (
              <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium text-white ${platformColors[post.platform]} shadow-md`}>
                {platformIcons[post.platform]}
              </div>
            )}

            {/* Status badge */}
            {post.status && (
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[post.status]} shadow-md`}>
                {statusIcons[post.status]} {post.status}
              </div>
            )}

            {/* Slot number badge */}
            {post.slot && (
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/70 text-white text-xs font-bold flex items-center justify-center">
                {post.slot}
              </div>
            )}

            {/* Hover overlay with slot number and caption */}
            {hoveredId === post.id && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 transition-opacity">
                {post.slot && (
                  <span className="text-white text-xl font-bold mb-1">#{post.slot}</span>
                )}
                {post.platform && (
                  <span className="text-white/80 text-xs mb-2">{post.platform}</span>
                )}
                {(post.name || post.caption) && (
                  <p className="text-white text-xs text-center line-clamp-3">
                    {post.name || post.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Attribution */}
      <div className="mt-4 text-center text-xs text-gray-400">
        Powered by Social Grid Planner
      </div>
    </div>
  )
}
