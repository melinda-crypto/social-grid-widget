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
  Draft: 'bg-gray-400',
  Ready: 'bg-amber-400',
  Scheduled: 'bg-blue-400',
  Posted: 'bg-emerald-400',
}

const gridConfigs = {
  '2x3': { cols: 2, maxPosts: 6 },
  '3x3': { cols: 3, maxPosts: 9 },
  '4x3': { cols: 4, maxPosts: 12 },
}

// Default settings
const DEFAULTS = {
  gridSize: '3x3' as GridSize,
  platformFilter: 'all' as PlatformFilter,
  sortMode: 'slot' as SortMode,
}

// Photo Modal Component
function PhotoModal({ post, onClose }: { post: SocialPost; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm font-medium"
        >
          ✕ Close
        </button>

        {/* Image */}
        <img
          src={post.imageUrl}
          alt={post.name || 'Post'}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Caption & details */}
        <div className="mt-4 text-white text-center" onClick={(e) => e.stopPropagation()}>
          {post.name && <h3 className="text-lg font-medium">{post.name}</h3>}
          {post.caption && <p className="text-white/70 text-sm mt-1">{post.caption}</p>}
          <div className="flex items-center justify-center gap-3 mt-3 text-xs text-white/50">
            {post.status && (
              <span className={`px-2 py-1 rounded-full text-white ${statusColors[post.status]}`}>
                {post.status}
              </span>
            )}
            {post.platform && <span>{post.platform}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sortable Post Item Component
function SortablePostItem({ post, onSelect, isDragDisabled }: {
  post: SocialPost
  onSelect: (post: SocialPost) => void
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

  const handleClick = () => {
    if (!isDragging) {
      onSelect(post)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`relative aspect-square overflow-hidden rounded-xl bg-gray-100 transition-all ${
        isDragDisabled ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } ${isDragging ? 'shadow-2xl scale-105 ring-4 ring-blue-400' : 'hover:ring-2 hover:ring-gray-300'}`}
    >
      <img
        src={post.imageUrl}
        alt={post.caption || post.name || 'Social media post'}
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Status badge - minimal, top right */}
      {post.status && (
        <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${statusColors[post.status]} shadow-md ring-2 ring-white`}
          title={post.status}
        />
      )}

      {/* Hover overlay - minimal */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
        <span className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full">
          Click to view
        </span>
      </div>
    </div>
  )
}

export default function SocialGrid({ posts: initialPosts }: SocialGridProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [gridSize, setGridSize] = useState<GridSize>(DEFAULTS.gridSize)
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>(DEFAULTS.platformFilter)
  const [sortMode, setSortMode] = useState<SortMode>(DEFAULTS.sortMode)
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

  const handleReset = useCallback(() => {
    setGridSize(DEFAULTS.gridSize)
    setPlatformFilter(DEFAULTS.platformFilter)
    setSortMode(DEFAULTS.sortMode)
    setPosts(initialPosts)
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }, [initialPosts, router])

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

      if (sortMode === 'slot') {
        setIsSaving(true)
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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 gap-4">
        <p className="text-lg">No posts found</p>
        <p className="text-sm">Add posts to your Notion database</p>
        <button
          onClick={handleReset}
          className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors text-gray-600"
        >
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* Controls - Clean minimal design */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {displayPosts.length} posts
          </span>
          {isSaving && (
            <span className="text-xs text-blue-500">Saving...</span>
          )}
        </div>

        {/* Right side - Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort mode */}
          <div className="flex rounded-full overflow-hidden bg-gray-100 p-0.5">
            <button
              onClick={() => setSortMode('slot')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                sortMode === 'slot'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setSortMode('date')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                sortMode === 'date'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              By Date
            </button>
          </div>

          {/* Platform filter */}
          <div className="flex rounded-full overflow-hidden bg-gray-100 p-0.5">
            {(['all', 'Instagram', 'TikTok'] as PlatformFilter[]).map((platform) => (
              <button
                key={platform}
                onClick={() => setPlatformFilter(platform)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  platformFilter === platform
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {platform === 'all' ? 'All' : platform === 'Instagram' ? 'IG' : 'TikTok'}
              </button>
            ))}
          </div>

          {/* Grid size */}
          <select
            value={gridSize}
            onChange={(e) => setGridSize(e.target.value as GridSize)}
            className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 cursor-pointer border-0 focus:ring-2 focus:ring-gray-300"
          >
            <option value="2x3">2×3</option>
            <option value="3x3">3×3</option>
            <option value="4x3">4×3</option>
          </select>

          {/* Reset button */}
          <button
            onClick={handleReset}
            disabled={isRefreshing}
            className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            {isRefreshing ? '...' : 'Reset'}
          </button>
        </div>
      </div>

      {/* Info banner for date mode */}
      {sortMode === 'date' && (
        <div className="mb-4 p-3 bg-gray-50 text-gray-500 text-xs rounded-xl text-center">
          Sorted by Publish Date — Edit dates in Notion to reorder
        </div>
      )}

      {/* Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={displayPosts.map(p => p.id)} strategy={rectSortingStrategy}>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${gridConfigs[gridSize].cols}, 1fr)` }}
          >
            {displayPosts.map((post) => (
              <SortablePostItem
                key={post.id}
                post={post}
                onSelect={setSelectedPost}
                isDragDisabled={sortMode === 'date'}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Status legend */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span>Draft</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Ready</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Posted</span>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPost && (
        <PhotoModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  )
}
