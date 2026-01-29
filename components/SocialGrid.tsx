'use client'

import { SocialPost } from '@/lib/notion'
import { useState, useCallback, useEffect, useRef } from 'react'
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

type GridSize = '3x3' | '3x4' | '3x5'
type PlatformFilter = 'all' | 'Instagram' | 'TikTok'
type FormatFilter = 'all' | 'Feed Post' | 'Reel' | 'Story' | 'Carousel'
type SortMode = 'slot' | 'date'

const gridConfigs = {
  '3x3': { cols: 3, maxPosts: 9 },
  '3x4': { cols: 3, maxPosts: 12 },
  '3x5': { cols: 3, maxPosts: 15 },
}

const DEFAULTS = {
  gridSize: '3x3' as GridSize,
  platformFilter: 'all' as PlatformFilter,
  formatFilter: 'all' as FormatFilter,
  sortMode: 'slot' as SortMode,
}

// Format icons
const formatIcons: Record<string, string> = {
  'Feed Post': '📷',
  'Reel': '🎬',
  'Story': '⏱️',
  'Carousel': '📑',
}

// Status colors
const statusColors: Record<string, string> = {
  'Draft': 'bg-gray-400',
  'Ready': 'bg-yellow-400',
  'Scheduled': 'bg-blue-400',
  'Posted': 'bg-green-400',
}

// Calculate days until publish
function getDaysUntil(dateStr: string): { text: string; urgent: boolean } {
  const publishDate = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  publishDate.setHours(0, 0, 0, 0)

  const diffTime = publishDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { text: 'Overdue', urgent: true }
  if (diffDays === 0) return { text: 'Today', urgent: true }
  if (diffDays === 1) return { text: 'Tomorrow', urgent: true }
  if (diffDays <= 7) return { text: `${diffDays}d`, urgent: false }
  return { text: `${Math.ceil(diffDays / 7)}w`, urgent: false }
}

// Extract dominant colors from image (simplified)
function useColorPalette(imageUrl: string) {
  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    if (!imageUrl) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = 50
        canvas.height = 50
        ctx.drawImage(img, 0, 0, 50, 50)

        const imageData = ctx.getImageData(0, 0, 50, 50).data
        const colorCounts: Record<string, number> = {}

        for (let i = 0; i < imageData.length; i += 16) {
          const r = Math.round(imageData[i] / 32) * 32
          const g = Math.round(imageData[i + 1] / 32) * 32
          const b = Math.round(imageData[i + 2] / 32) * 32
          const color = `rgb(${r},${g},${b})`
          colorCounts[color] = (colorCounts[color] || 0) + 1
        }

        const sorted = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([color]) => color)

        setColors(sorted)
      } catch {
        // CORS or other error, skip
      }
    }
  }, [imageUrl])

  return colors
}

// Photo Modal with caption
function PhotoModal({ post, onClose }: { post: SocialPost; onClose: () => void }) {
  const colors = useColorPalette(post.imageUrl)

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={post.imageUrl}
          alt={post.name || 'Post'}
          className="w-full rounded-2xl shadow-2xl"
        />

        {/* Color Palette */}
        {colors.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-xs text-white/40">Colors:</span>
            {colors.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white/20"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}

        {(post.name || post.caption) && (
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              {post.format && (
                <span className="text-lg" title={post.format}>{formatIcons[post.format]}</span>
              )}
              {post.name && <h3 className="text-white text-lg font-medium">{post.name}</h3>}
            </div>

            {post.caption && (
              <p className="text-white/70 text-sm leading-relaxed">{post.caption}</p>
            )}

            <div className="flex items-center flex-wrap gap-2 mt-4">
              {post.status && (
                <span className={`px-3 py-1 rounded-full text-xs text-white ${statusColors[post.status]}`}>
                  {post.status}
                </span>
              )}
              {post.platform && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60">
                  {post.platform}
                </span>
              )}
              {post.publishDate && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60">
                  📅 {new Date(post.publishDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Sortable Post Item with overlays
function SortablePostItem({ post, onSelect, isDragDisabled, showOverlays }: {
  post: SocialPost
  onSelect: (post: SocialPost) => void
  isDragDisabled: boolean
  showOverlays: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
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
  }

  const dateInfo = post.publishDate ? getDaysUntil(post.publishDate) : null

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onSelect(post)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative aspect-square overflow-hidden bg-gray-100 transition-all duration-200 ${
        isDragDisabled ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } ${isDragging ? 'opacity-50 scale-105 z-50' : ''}`}
    >
      <img
        src={post.imageUrl}
        alt={post.name || ''}
        className="w-full h-full object-cover"
        draggable={false}
      />

      {showOverlays && (
        <>
          {/* Format icon - top left */}
          {post.format && (
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-xs">
              {formatIcons[post.format]}
            </div>
          )}

          {/* Status dot - top right */}
          {post.status && (
            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${statusColors[post.status]} ring-2 ring-white/50`}
              title={post.status}
            />
          )}

          {/* Date badge - bottom right */}
          {dateInfo && (
            <div className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              dateInfo.urgent ? 'bg-red-500 text-white' : 'bg-black/60 text-white'
            }`}>
              {dateInfo.text}
            </div>
          )}
        </>
      )}

      {/* Caption preview on hover */}
      {isHovered && post.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
          <p className="text-white text-[10px] leading-tight line-clamp-3">
            {post.caption}
          </p>
        </div>
      )}
    </div>
  )
}

export default function SocialGrid({ posts: initialPosts }: SocialGridProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [gridSize, setGridSize] = useState<GridSize>(DEFAULTS.gridSize)
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>(DEFAULTS.platformFilter)
  const [formatFilter, setFormatFilter] = useState<FormatFilter>(DEFAULTS.formatFilter)
  const [sortMode, setSortMode] = useState<SortMode>(DEFAULTS.sortMode)
  const [showOverlays, setShowOverlays] = useState(true)
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleReset = useCallback(() => {
    setGridSize(DEFAULTS.gridSize)
    setPlatformFilter(DEFAULTS.platformFilter)
    setFormatFilter(DEFAULTS.formatFilter)
    setSortMode(DEFAULTS.sortMode)
    setShowOverlays(true)
    setPosts(initialPosts)
    router.refresh()
  }, [initialPosts, router])

  const saveSlotToNotion = async (pageId: string, slot: number) => {
    try {
      const res = await fetch('/api/update-slot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_SECRET || '',
        },
        body: JSON.stringify({ pageId, slot }),
      })
      return res.ok
    } catch { return false }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = posts.findIndex((p) => p.id === active.id)
      const newIndex = posts.findIndex((p) => p.id === over.id)
      const newPosts = arrayMove(posts, oldIndex, newIndex)
      setPosts(newPosts)

      if (sortMode === 'slot') {
        setIsSaving(true)
        await Promise.all(newPosts.map((p, i) => saveSlotToNotion(p.id, i + 1)))
        setIsSaving(false)
      }
    }
  }

  // Apply filters
  let filteredPosts = posts
  if (platformFilter !== 'all') {
    filteredPosts = filteredPosts.filter(p => p.platform === platformFilter)
  }
  if (formatFilter !== 'all') {
    filteredPosts = filteredPosts.filter(p => p.format === formatFilter)
  }

  const displayPosts = filteredPosts.slice(0, gridConfigs[gridSize].maxPosts)

  // Calculate color palette for visible posts (top 3 colors across all)
  const allColors = displayPosts.flatMap(p => {
    // We can't easily aggregate here without hooks, so skip for grid-level
    return []
  })

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400">
        <p>No posts yet</p>
        <button onClick={handleReset} className="mt-4 text-sm text-gray-500 hover:text-gray-700">
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Settings Panel */}
      <div className="mb-4 p-4 bg-gray-50 rounded-2xl space-y-3">
        {/* Sort */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Sort by</span>
          <div className="flex gap-1 bg-white rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => setSortMode('slot')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                sortMode === 'slot' ? 'bg-gray-900 text-white' : 'text-gray-500'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setSortMode('date')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                sortMode === 'date' ? 'bg-gray-900 text-white' : 'text-gray-500'
              }`}
            >
              Date
            </button>
          </div>
        </div>

        {/* Platform Filter */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Platform</span>
          <div className="flex gap-1 bg-white rounded-lg p-0.5 shadow-sm">
            {(['all', 'Instagram', 'TikTok'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  platformFilter === p ? 'bg-gray-900 text-white' : 'text-gray-500'
                }`}
              >
                {p === 'all' ? 'All' : p === 'Instagram' ? 'IG' : 'TT'}
              </button>
            ))}
          </div>
        </div>

        {/* Format Filter */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Format</span>
          <div className="flex gap-1 bg-white rounded-lg p-0.5 shadow-sm overflow-x-auto">
            {(['all', 'Feed Post', 'Reel', 'Story', 'Carousel'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormatFilter(f)}
                className={`px-2 py-1 text-xs rounded-md transition-all whitespace-nowrap ${
                  formatFilter === f ? 'bg-gray-900 text-white' : 'text-gray-500'
                }`}
              >
                {f === 'all' ? 'All' : formatIcons[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Size */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Rows</span>
          <div className="flex gap-1 bg-white rounded-lg p-0.5 shadow-sm">
            {(['3x3', '3x4', '3x5'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setGridSize(size)}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  gridSize === size ? 'bg-gray-900 text-white' : 'text-gray-500'
                }`}
              >
                {size.split('x')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Overlays Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Show badges</span>
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`w-10 h-5 rounded-full transition-colors ${
              showOverlays ? 'bg-gray-900' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
              showOverlays ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* Reset & Status */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-200">
          {isSaving ? (
            <span className="text-xs text-blue-500">Saving...</span>
          ) : (
            <span className="text-xs text-gray-400">{displayPosts.length} posts</span>
          )}
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Legend */}
      {showOverlays && (
        <div className="mb-3 flex items-center justify-center gap-4 text-[10px] text-gray-400">
          <span>📷 Feed</span>
          <span>🎬 Reel</span>
          <span>⏱️ Story</span>
          <span>📑 Carousel</span>
        </div>
      )}

      {/* Grid */}
      <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={displayPosts.map(p => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-[1px] bg-gray-200">
              {displayPosts.map((post) => (
                <SortablePostItem
                  key={post.id}
                  post={post}
                  onSelect={setSelectedPost}
                  isDragDisabled={sortMode === 'date'}
                  showOverlays={showOverlays}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Footer */}
      <p className="mt-4 text-center text-xs text-gray-300">
        {sortMode === 'slot' ? 'Drag to reorder • Hover for caption' : 'Edit dates in Notion'}
      </p>

      {/* Photo Modal */}
      {selectedPost && (
        <PhotoModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  )
}
