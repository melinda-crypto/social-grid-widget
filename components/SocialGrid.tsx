'use client'

import { SocialPost } from '@/lib/notion'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SocialGridProps {
  posts: SocialPost[]
}

type GridSize = '2x3' | '3x3' | '4x3'
type PlatformFilter = 'all' | 'Instagram' | 'TikTok'
type SortMode = 'slot' | 'date'

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

const gridConfigs = {
  '2x3': { cols: 2, maxPosts: 6 },
  '3x3': { cols: 3, maxPosts: 9 },
  '4x3': { cols: 4, maxPosts: 12 },
}

// Sortable Post Item Component
function SortablePostItem({ post, hoveredId, setHoveredId, isDragDisabled }: {
  post: SocialPost
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
  isDragDisabled: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id, disabled: isDragDisabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 transition-transform ${
        isDragDisabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
      } ${isDragging ? 'shadow-2xl scale-105' : 'hover:scale-[1.02]'}`}
      onMouseEnter={() => setHoveredId(post.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <img
        src={post.imageUrl}
        alt={post.caption || post.name || 'Social media post'}
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
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

      {/* Hover overlay */}
      {hoveredId === post.id && !isDragging && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 pointer-events-none">
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
          {!isDragDisabled && (
            <span className="text-white/50 text-xs mt-2">Drag to reorder</span>
          )}
        </div>
      )}
    </div>
  )
}

export default function SocialGrid({ posts: initialPosts }: SocialGridProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [gridSize, setGridSize] = useState<GridSize>('3x3')
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('slot')
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }, [router])

  const saveSlotToNotion = async (pageId: string, slot: number) => {
    try {
      const response = await fetch('/api/update-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, slot }),
      })
      return response.ok
    } catch (error) {
      console.error('Failed to save slot:', error)
      return false
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = posts.findIndex((item) => item.id === active.id)
      const newIndex = posts.findIndex((item) => item.id === over.id)
      const newPosts = arrayMove(posts, oldIndex, newIndex)

      setPosts(newPosts)

      // Save new order to Notion (only in slot mode)
      if (sortMode === 'slot') {
        setIsSaving(true)

        // Update slots for all reordered posts
        const updates = newPosts.map((post, index) =>
          saveSlotToNotion(post.id, index + 1)
        )

        await Promise.all(updates)
        setIsSaving(false)
      }
    }
  }

  // Filter posts by platform
  const filteredPosts = platformFilter === 'all'
    ? posts
    : posts.filter(post => post.platform === platformFilter)

  // Limit posts based on grid size
  const displayPosts = filteredPosts.slice(0, gridConfigs[gridSize].maxPosts)

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
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        {/* Left side - Post count & saving status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {displayPosts.length} posts
          </span>
          {isSaving && (
            <span className="text-xs text-blue-500 animate-pulse">💾 Saving...</span>
          )}
        </div>

        {/* Right side - Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort mode toggle */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => setSortMode('slot')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                sortMode === 'slot'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              📍 By Slot
            </button>
            <button
              onClick={() => setSortMode('date')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                sortMode === 'date'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              📅 By Date
            </button>
          </div>

          {/* Platform filter */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            {(['all', 'Instagram', 'TikTok'] as PlatformFilter[]).map((platform) => (
              <button
                key={platform}
                onClick={() => setPlatformFilter(platform)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  platformFilter === platform
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {platform === 'all' ? '🌐 All' : platform === 'Instagram' ? '📸 IG' : '🎵 TT'}
              </button>
            ))}
          </div>

          {/* Grid size selector */}
          <select
            value={gridSize}
            onChange={(e) => setGridSize(e.target.value as GridSize)}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-600 cursor-pointer"
          >
            <option value="2x3">2×3 Grid</option>
            <option value="3x3">3×3 Grid</option>
            <option value="4x3">4×3 Grid</option>
          </select>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg text-xs font-medium transition-all"
          >
            <span className={`inline-block ${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
            Reset
          </button>
        </div>
      </div>

      {/* Info banner for date mode */}
      {sortMode === 'date' && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-700 text-xs rounded-lg text-center">
          📅 Sorted by Publish Date — Change dates in Notion to reorder
        </div>
      )}

      {/* Grid with drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={displayPosts.map(p => p.id)} strategy={rectSortingStrategy}>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${gridConfigs[gridSize].cols}, 1fr)` }}
          >
            {displayPosts.map((post) => (
              <SortablePostItem
                key={post.id}
                post={post}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                isDragDisabled={sortMode === 'date'}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Attribution */}
      <div className="mt-4 text-center text-xs text-gray-400">
        Powered by Social Grid Planner • {sortMode === 'slot' ? 'Drag to reorder (saves to Notion)' : 'Sorted by date'}
      </div>
    </div>
  )
}
