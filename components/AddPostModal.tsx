'use client'

import { useState } from 'react'

interface AddPostModalProps {
  onClose: () => void
  onSuccess: () => void
  suggestedSlot?: number
}

export default function AddPostModal({ onClose, onSuccess, suggestedSlot }: AddPostModalProps) {
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [format, setFormat] = useState<string>('Feed Post')
  const [platform, setPlatform] = useState<string>('Instagram')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Validate and preview image URL
  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    setImagePreview(null)

    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      // Try to load the image
      const img = new Image()
      img.onload = () => setImagePreview(url)
      img.onerror = () => setImagePreview(null)
      img.src = url
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_SECRET || '',
        },
        body: JSON.stringify({
          name,
          imageUrl: imageUrl || undefined,
          caption: caption || undefined,
          format,
          platform,
          slot: suggestedSlot,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create post')
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">✨ Add New Post</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative aspect-square w-full max-w-[200px] mx-auto rounded-xl overflow-hidden bg-gray-100">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                ✓ Image loaded
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Post Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Monday Motivation"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
            <p className="mt-1 text-xs text-gray-400">
              💡 Paste Canva share link, Unsplash URL, or any image URL
            </p>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Your caption with #hashtags..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Format & Platform Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm bg-white"
              >
                <option value="Feed Post">📷 Feed Post</option>
                <option value="Reel">🎬 Reel</option>
                <option value="Story">⏱️ Story</option>
                <option value="Carousel">📑 Carousel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm bg-white"
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name}
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add to Grid →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
