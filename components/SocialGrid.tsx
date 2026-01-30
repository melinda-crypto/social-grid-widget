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
import PhoneMockup from './PhoneMockup'

type ViewMode = 'grid' | 'phone'

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

// Status colors - now used for left border
const statusColors: Record<string, string> = {
  'Draft': 'border-l-gray-400',
  'Ready': 'border-l-amber-400',
  'Scheduled': 'border-l-blue-400',
  'Posted': 'border-l-emerald-400',
}

const statusBgColors: Record<string, string> = {
  'Draft': 'bg-gray-400',
  'Ready': 'bg-amber-400',
  'Scheduled': 'bg-blue-400',
  'Posted': 'bg-emerald-400',
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

// Media Modal with video/carousel support
function PhotoModal({ post, onClose }: { post: SocialPost; onClose: () => void }) {
  const colors = useColorPalette(post.imageUrl)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const isVideo = post.mediaType === 'video'
  const isCarousel = post.mediaType === 'carousel' && post.images && post.images.length > 1

  const handlePrev = () => {
    if (isCarousel && post.images) {
      setCarouselIndex((prev) => (prev === 0 ? post.images!.length - 1 : prev - 1))
    }
  }

  const handleNext = () => {
    if (isCarousel && post.images) {
      setCarouselIndex((prev) => (prev === post.images!.length - 1 ? 0 : prev + 1))
    }
  }

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
        {/* Video Player */}
        {isVideo && post.videoUrl ? (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
            <video
              src={post.videoUrl}
              className="w-full max-h-[70vh] object-contain"
              controls
              autoPlay
              loop
              playsInline
            />
          </div>
        ) : isCarousel && post.images ? (
          /* Carousel with navigation */
          <div className="relative">
            <img
              src={post.images[carouselIndex]}
              alt={`${post.name || 'Post'} - ${carouselIndex + 1}`}
              className="w-full rounded-2xl shadow-2xl"
            />
            {/* Navigation arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {post.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCarouselIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === carouselIndex ? 'bg-white scale-110' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Regular image */
          <img
            src={post.imageUrl}
            alt={post.name || 'Post'}
            className="w-full rounded-2xl shadow-2xl"
          />
        )}

        {/* Color Palette */}
        {colors.length > 0 && !isVideo && (
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
              {isVideo && (
                <span className="text-lg" title="Video">🎬</span>
              )}
              {post.name && <h3 className="text-white text-lg font-medium">{post.name}</h3>}
            </div>

            {post.caption && (
              <p className="text-white/70 text-sm leading-relaxed">{post.caption}</p>
            )}

            <div className="flex items-center flex-wrap gap-2 mt-4">
              {post.status && (
                <span className={`px-3 py-1 rounded-full text-xs text-white ${statusBgColors[post.status]}`}>
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
              {isCarousel && post.images && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60">
                  📑 {carouselIndex + 1}/{post.images.length}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Sortable Post Item with sleek overlays and video support
function SortablePostItem({ post, onSelect, isDragDisabled, showOverlays }: {
  post: SocialPost
  onSelect: (post: SocialPost) => void
  isDragDisabled: boolean
  showOverlays: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
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
  const isVideo = post.mediaType === 'video'
  const isCarousel = post.mediaType === 'carousel'

  // Handle video hover play/pause
  useEffect(() => {
    if (videoRef.current && isVideo) {
      if (isHovered) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [isHovered, isVideo])

  // Get display image (thumbnail for video, first image otherwise)
  const displayImage = isVideo
    ? (post.thumbnailUrl || post.imageUrl)
    : post.imageUrl

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
      } ${isDragging ? 'opacity-50 scale-105 z-50' : ''} ${
        showOverlays && post.status ? `border-l-[3px] ${statusColors[post.status]}` : ''
      }`}
    >
      {/* Video with hover-to-play */}
      {isVideo && post.videoUrl ? (
        <>
          {/* Show thumbnail when not hovering */}
          {!isHovered && displayImage && (
            <img
              src={displayImage}
              alt={post.name || ''}
              className="w-full h-full object-cover absolute inset-0"
              draggable={false}
            />
          )}
          {/* Video element - plays on hover */}
          <video
            ref={videoRef}
            src={post.videoUrl}
            className={`w-full h-full object-cover ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            muted
            loop
            playsInline
            preload="metadata"
          />
        </>
      ) : (
        /* Regular image */
        <img
          src={displayImage}
          alt={post.name || ''}
          className="w-full h-full object-cover"
          draggable={false}
        />
      )}

      {showOverlays && (
        <>
          {/* Video icon - top right */}
          {isVideo && (
            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}

          {/* Carousel indicator - top right (if not video) */}
          {isCarousel && !isVideo && (
            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-1">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-[8px] text-white font-medium">{post.images?.length}</span>
            </div>
          )}

          {/* Format pill - top left with glass effect */}
          {post.format && (
            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-[9px] text-white/90 flex items-center gap-0.5">
              <span>{formatIcons[post.format]}</span>
            </div>
          )}

          {/* Date pill - bottom right with glass effect */}
          {dateInfo && (
            <div className={`absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium backdrop-blur-sm ${
              dateInfo.urgent
                ? 'bg-red-500/80 text-white'
                : 'bg-black/40 text-white/90'
            }`}>
              {dateInfo.text}
            </div>
          )}
        </>
      )}

      {/* Caption preview on hover (only for images, not when video is playing) */}
      {isHovered && post.caption && !isVideo && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 pt-10">
          <p className="text-white text-[9px] leading-tight line-clamp-2 font-medium">
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
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [settingsOpen, setSettingsOpen] = useState(false)
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
        await Promise.all(newPosts.map((p: SocialPost, i: number) => saveSlotToNotion(p.id, i + 1)))
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
      {/* Minimal Top Bar */}
      <div className="mb-3 flex items-center justify-between">
        {/* View Toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-full p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-xs rounded-full transition-all ${
              viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('phone')}
            className={`px-3 py-1.5 text-xs rounded-full transition-all ${
              viewMode === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            📱
          </button>
        </div>

        {/* Post count & Settings toggle */}
        <div className="flex items-center gap-2">
          {isSaving && <span className="text-[10px] text-blue-500">Saving...</span>}
          <span className="text-[10px] text-gray-400">{displayPosts.length} posts</span>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
              settingsOpen ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Collapsible Settings Panel */}
      {settingsOpen && (
        <div className="mb-4 p-3 bg-gray-50/80 backdrop-blur-sm rounded-2xl space-y-2.5 border border-gray-100">
          {/* Sort */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Sort</span>
            <div className="flex gap-0.5 bg-white rounded-full p-0.5 shadow-sm">
              <button
                onClick={() => setSortMode('slot')}
                className={`px-2.5 py-1 text-[10px] rounded-full transition-all ${
                  sortMode === 'slot' ? 'bg-gray-900 text-white' : 'text-gray-400'
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => setSortMode('date')}
                className={`px-2.5 py-1 text-[10px] rounded-full transition-all ${
                  sortMode === 'date' ? 'bg-gray-900 text-white' : 'text-gray-400'
                }`}
              >
                Date
              </button>
            </div>
          </div>

          {/* Platform */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Platform</span>
            <div className="flex gap-0.5 bg-white rounded-full p-0.5 shadow-sm">
              {(['all', 'Instagram', 'TikTok'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={`px-2.5 py-1 text-[10px] rounded-full transition-all ${
                    platformFilter === p ? 'bg-gray-900 text-white' : 'text-gray-400'
                  }`}
                >
                  {p === 'all' ? 'All' : p === 'Instagram' ? 'IG' : 'TT'}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Format</span>
            <div className="flex gap-0.5 bg-white rounded-full p-0.5 shadow-sm">
              {(['all', 'Feed Post', 'Reel', 'Story', 'Carousel'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormatFilter(f)}
                  className={`px-2 py-1 text-[10px] rounded-full transition-all ${
                    formatFilter === f ? 'bg-gray-900 text-white' : 'text-gray-400'
                  }`}
                >
                  {f === 'all' ? 'All' : formatIcons[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Rows</span>
            <div className="flex gap-0.5 bg-white rounded-full p-0.5 shadow-sm">
              {(['3x3', '3x4', '3x5'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setGridSize(size)}
                  className={`px-2.5 py-1 text-[10px] rounded-full transition-all ${
                    gridSize === size ? 'bg-gray-900 text-white' : 'text-gray-400'
                  }`}
                >
                  {size.split('x')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Badges & Reset */}
          <div className="flex items-center justify-between pt-1.5 border-t border-gray-200/50">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400">Badges</span>
              <button
                onClick={() => setShowOverlays(!showOverlays)}
                className={`w-8 h-4 rounded-full transition-colors ${
                  showOverlays ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${
                  showOverlays ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <button
              onClick={handleReset}
              className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          <div className="rounded-2xl overflow-hidden bg-white shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1)] ring-1 ring-gray-100">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={displayPosts.map(p => p.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-3 gap-[1px] bg-gray-100">
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

          {/* Minimal Footer */}
          <p className="mt-3 text-center text-[10px] text-gray-300">
            {sortMode === 'slot' ? 'Drag to reorder' : 'Sorted by date'}
          </p>
        </>
      )}

      {/* Phone Preview View */}
      {viewMode === 'phone' && (
        <PhoneMockup postsCount={displayPosts.length}>
          <div className="grid grid-cols-3 gap-[1px] bg-gray-200">
            {displayPosts.slice(0, 9).map((post) => (
              <div
                key={post.id}
                className="aspect-square bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedPost(post)}
              >
                <img
                  src={post.imageUrl}
                  alt={post.name || 'Post'}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </PhoneMockup>
      )}

      {/* Photo Modal */}
      {selectedPost && (
        <PhotoModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  )
}
