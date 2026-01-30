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
import AddPostModal from './AddPostModal'
import TutorialOverlay from './TutorialOverlay'

// Local storage key for tutorial
const TUTORIAL_SHOWN_KEY = 'social-grid-tutorial-shown'

type ViewMode = 'grid' | 'phone'

interface SocialGridProps {
  posts: SocialPost[]
}

type GridSize = '3x3' | '3x4' | '3x5'
type SortMode = 'slot' | 'date'

const gridConfigs = {
  '3x3': { cols: 3, maxPosts: 9 },
  '3x4': { cols: 3, maxPosts: 12 },
  '3x5': { cols: 3, maxPosts: 15 },
}

const DEFAULTS = {
  gridSize: '3x3' as GridSize,
  sortMode: 'slot' as SortMode,
}

// Format icons
const formatIcons: Record<string, string> = {
  'Feed Post': '📷',
  'Reel': '🎬',
  'Story': '⏱️',
  'Carousel': '📑',
}

// Status pill styles - clean 5-stage workflow (synced with Notion)
// Softened opacity for less visual dominance
const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  'Idea': { bg: 'bg-purple-500/60', text: 'text-white', label: 'Idea' },
  'Draft': { bg: 'bg-gray-500/60', text: 'text-white', label: 'Draft' },
  'Ready': { bg: 'bg-amber-500/60', text: 'text-white', label: 'Ready' },
  'Scheduled': { bg: 'bg-blue-500/60', text: 'text-white', label: 'Scheduled' },
  'Live': { bg: 'bg-emerald-500/60', text: 'text-white', label: 'Live' },
}

const statusBgColors: Record<string, string> = {
  'Idea': 'bg-purple-500',
  'Draft': 'bg-gray-500',
  'Ready': 'bg-amber-500',
  'Scheduled': 'bg-blue-500',
  'Live': 'bg-emerald-500',
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
      } ${isDragging ? 'opacity-50 scale-105 z-50' : ''} ${isHovered && !isDragging ? 'scale-[1.02] shadow-lg z-10' : ''}`}
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

          {/* Status pill - bottom left */}
          {post.status && statusStyles[post.status] && (
            <div className={`absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-[8px] font-medium backdrop-blur-sm ${statusStyles[post.status].bg} ${statusStyles[post.status].text}`}>
              {statusStyles[post.status].label}
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

      {/* Drag handle - shows on hover when dragging is enabled */}
      {isHovered && !isDragDisabled && !isDragging && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <svg className="w-4 h-4 text-white/90" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        </div>
      )}

      {/* Caption preview on hover (only for images, not when video is playing) */}
      {isHovered && post.caption && !isVideo && !isDragDisabled && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 pt-10">
          <p className="text-white text-[9px] leading-tight line-clamp-2 font-medium">
            {post.caption}
          </p>
        </div>
      )}
    </div>
  )
}

// Empty slot placeholder component
function EmptySlot({ onClick }: { onClick: () => void; slotNumber: number }) {
  return (
    <div
      onClick={onClick}
      className="relative aspect-square bg-gray-50/50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100/50 hover:border-gray-300 transition-all duration-200 group"
    >
      <div className="w-7 h-7 rounded-full bg-gray-200/80 group-hover:bg-gray-300/80 flex items-center justify-center transition-colors">
        <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-[8px] text-gray-400 mt-1 group-hover:text-gray-500 tracking-wide">Add post</span>
    </div>
  )
}

export default function SocialGrid({ posts: initialPosts }: SocialGridProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [gridSize, setGridSize] = useState<GridSize>(DEFAULTS.gridSize)
  const [sortMode, setSortMode] = useState<SortMode>(DEFAULTS.sortMode)
  const [showOverlays, setShowOverlays] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addModalSlot, setAddModalSlot] = useState<number | undefined>(undefined)
  const [showTutorial, setShowTutorial] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Check if tutorial should be shown (first time user)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tutorialShown = localStorage.getItem(TUTORIAL_SHOWN_KEY)
      if (!tutorialShown && initialPosts.length > 0) {
        setShowTutorial(true)
      }
    }
  }, [initialPosts.length])

  const dismissTutorial = () => {
    setShowTutorial(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(TUTORIAL_SHOWN_KEY, 'true')
    }
  }

  // Export grid as image
  const handleExport = async () => {
    if (!gridRef.current) return
    setIsExporting(true)

    try {
      // Dynamic import html2canvas
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(gridRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      })

      // Download the image
      const link = document.createElement('a')
      link.download = `social-grid-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Some external images may not be captured due to security restrictions.')
    } finally {
      setIsExporting(false)
    }
  }

  // Handle adding a post
  const handleAddPost = (slot?: number) => {
    setAddModalSlot(slot)
    setShowAddModal(true)
  }

  const handlePostAdded = () => {
    router.refresh()
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleReset = useCallback(() => {
    setGridSize(DEFAULTS.gridSize)
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

  // Get posts for display (Instagram only)
  const displayPosts = posts.slice(0, gridConfigs[gridSize].maxPosts)

  // Calculate color palette for visible posts (top 3 colors across all)
  const allColors = displayPosts.flatMap(p => {
    // We can't easily aggregate here without hooks, so skip for grid-level
    return []
  })

  // Demo posts for empty state
  const demoPosts: SocialPost[] = [
    { id: 'demo-1', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', mediaType: 'image', format: 'Feed Post', status: 'Ready' },
    { id: 'demo-2', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop', mediaType: 'image', format: 'Reel', status: 'Scheduled' },
    { id: 'demo-3', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', mediaType: 'image', format: 'Carousel', status: 'Draft' },
    { id: 'demo-4', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop', mediaType: 'image', format: 'Feed Post', status: 'Ready' },
    { id: 'demo-5', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop', mediaType: 'image', format: 'Story', status: 'Draft' },
    { id: 'demo-6', imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop', mediaType: 'image', format: 'Reel', status: 'Ready' },
    { id: 'demo-7', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', mediaType: 'image', format: 'Feed Post', status: 'Draft' },
    { id: 'demo-8', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', mediaType: 'image', format: 'Feed Post', status: 'Scheduled' },
    { id: 'demo-9', imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop', mediaType: 'image', format: 'Carousel', status: 'Draft' },
  ]

  const isDemo = posts.length === 0
  const postsToUse = isDemo ? demoPosts : posts

  if (isDemo) {
    return (
      <div className="w-full max-w-md mx-auto">
        {/* Demo badge */}
        <div className="mb-3 text-center">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
            ✨ Demo Mode — Connect your Notion database to get started
          </span>
        </div>

        {/* Demo Grid */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1)] ring-1 ring-gray-100 opacity-75">
          <div className="grid grid-cols-3 gap-[1px] bg-gray-100">
            {demoPosts.map((post) => (
              <div key={post.id} className="relative aspect-square bg-gray-100">
                <img
                  src={post.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {post.format && (
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-[9px] text-white/90">
                    {formatIcons[post.format]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-gray-500">See your content together, before you post.</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
          >
            Refresh to load posts
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Compact Top Bar - Single Row Controls */}
      <div className="mb-3 flex items-center justify-between">
        {/* Left: View + Sort (inline) */}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex gap-0.5 bg-gray-100 rounded-full p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 text-[11px] rounded-full transition-all ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('phone')}
              className={`px-2 py-1 text-[11px] rounded-full transition-all ${
                viewMode === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
              }`}
            >
              📱
            </button>
          </div>

          {/* Sort Toggle (inline, compact) */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-gray-400">Sort:</span>
            <button
              onClick={() => setSortMode(sortMode === 'slot' ? 'date' : 'slot')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {sortMode === 'slot' ? 'Manual' : 'Date'} <span className="text-gray-300">▾</span>
            </button>
          </div>
        </div>

        {/* Right: Badges icon + post count */}
        <div className="flex items-center gap-2">
          {isSaving && <span className="text-[10px] text-blue-500">Saving...</span>}
          <span className="text-[10px] text-gray-400">{displayPosts.length} posts</span>
          {/* Badges Icon Toggle */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${
              showOverlays ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
            title={showOverlays ? 'Hide badges' : 'Show badges'}
          >
            <svg className="w-3.5 h-3.5" fill={showOverlays ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          <div ref={gridRef} className="rounded-2xl overflow-hidden bg-white shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1)] ring-1 ring-gray-100">
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
                  {/* Empty slot placeholders - Visual Planning Mode */}
                  {displayPosts.length < gridConfigs[gridSize].maxPosts &&
                    Array.from({ length: gridConfigs[gridSize].maxPosts - displayPosts.length }).map((_, i) => (
                      <EmptySlot
                        key={`empty-${i}`}
                        slotNumber={displayPosts.length + i + 1}
                        onClick={() => handleAddPost(displayPosts.length + i + 1)}
                      />
                    ))
                  }
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Action Footer - with subtle divider */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[10px] text-gray-500">
              {sortMode === 'slot' ? '⤢ Drag posts to rearrange' : '📅 Sorted by date'}
            </p>
            <div className="flex items-center gap-2">
              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                title="Export as image"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {isExporting ? 'Saving...' : 'Export'}
              </button>
              {/* Add post Button - lowercase */}
              <button
                onClick={() => handleAddPost()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[10px] rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add post
              </button>
            </div>
          </div>
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

      {/* Add Post Modal */}
      {showAddModal && (
        <AddPostModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handlePostAdded}
          suggestedSlot={addModalSlot}
        />
      )}

      {/* Tutorial Overlay (first-time users) */}
      {showTutorial && (
        <TutorialOverlay onDismiss={dismissTutorial} />
      )}
    </div>
  )
}
