'use client'

import { InstagramPost } from '@/lib/notion'
import { useState } from 'react'

interface InstagramGridProps {
  posts: InstagramPost[]
}

const statusColors: Record<string, string> = {
  Idea: 'bg-purple-500',
  Draft: 'bg-gray-500',
  Ready: 'bg-yellow-500',
  Scheduled: 'bg-blue-500',
  Live: 'bg-green-500',
  Posted: 'bg-green-500', // Legacy support
}

const statusIcons: Record<string, string> = {
  Idea: '💡',
  Draft: '✏️',
  Ready: '✅',
  Scheduled: '📅',
  Live: '🚀',
  Posted: '🚀', // Legacy support
}

export default function InstagramGrid({ posts }: InstagramGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        <p>No posts found. Add posts to your Notion database.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
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
              alt={post.caption || post.name || 'Instagram post'}
              className="w-full h-full object-cover"
            />

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
        Powered by IG Grid Planner
      </div>
    </div>
  )
}
