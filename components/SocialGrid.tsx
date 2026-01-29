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

type GridSize = '3x3' | '3x4' | '3x5'
type PlatformFilter = 'all' | 'Instagram' | 'TikTok'
type SortMode = 'slot' | 'date'

const gridConfigs = {
  '3x3': { cols: 3, maxPosts: 9 },
  '3x4': { cols: 3, maxPosts: 12 },
  '3x5': { cols: 3, maxPosts: 15 },
}

const DEFAULTS = {
  gridSize: '3x3' as GridSize,
  platformFilter: 'all' as PlatformFilter,
  sortMode: 'slot' as SortMode,
  showSettings: false,
}

// Photo Modal
function PhotoModal({ post, onClose }: { post: SocialPost; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
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

      <div className="max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={post.imageUrl}
          alt={post.name || 'Post'}
          className="w-full rounded-2xl shadow-2xl"
        />

        {(post.name || post.caption) && (
          <div className="mt-6 text-center">
            {post.name && <h3 className="text-white text-lg font-medium">{post.name}</h3>}
            {post.caption && <p className="text-white/60 text-sm mt-2 max-w-md mx-auto">{post.caption}</p>}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/40">
              {post.status && <span className="px-3 py-1 rounded-full bg-white/10">{post.status}</span>}
              {post.platform && <span>{post.platform}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Sortable Post Item
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
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onSelect(post)}
      className={`relative aspect-square overflow-hidden bg-gray-100 transition-all duration-200 ${
        isDragDisabled ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } ${isDragging ? 'opacity-50 scale-105 z-50' : 'hover:opacity-90'}`}
    >
      <img
        src={post.imageUrl}
        alt={post.name || ''}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  )
}

export default function SocialGrid({ posts: initialPosts }: SocialGridProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [gridSize, setGridSize] = useState<GridSize>(DEFAULTS.gridSize)
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>(DEFAULTS.platformFilter)
  const [sortMode, setSortMode] = useState<SortMode>(DEFAULTS.sortMode)
  const [showSettings, setShowSettings] = useState(false)
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleReset = useCallback(() => {
    setGridSize(DEFAULTS.gridSize)
    setPlatformFilter(DEFAULTS.platformFilter)
    setSortMode(DEFAULTS.sortMode)
    setPosts(initialPosts)
    setShowSettings(false)
    router.refresh()
  }, [initialPosts, router])

  const saveSlotToNotion = async (pageId: string, slot: number) => {
    try {
      const res = await fetch('/api/update-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const filteredPosts = platformFilter === 'all'
    ? posts
    : posts.filter(p => p.platform === platformFilter)

  const displayPosts = filteredPosts.slice(0, gridConfigs[gridSize].maxPosts)

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
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-xs text-gray-400">Saving...</span>
          )}
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
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

          {/* Platform */}
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

          {/* Reset */}
          <button
            onClick={handleReset}
            className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Reset to defaults
          </button>
        </div>
      )}

      {/* Grid - Instagram style */}
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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Footer hint */}
      <p className="mt-4 text-center text-xs text-gray-300">
        {sortMode === 'slot' ? 'Drag to reorder' : 'Edit dates in Notion'}
      </p>

      {/* Photo Modal */}
      {selectedPost && (
        <PhotoModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  )
}
