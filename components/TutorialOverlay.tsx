'use client'

import { useState, useEffect } from 'react'

interface TutorialOverlayProps {
  onDismiss: () => void
}

export default function TutorialOverlay({ onDismiss }: TutorialOverlayProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      icon: '↔️',
      title: 'Drag to reorder',
      description: 'Rearrange your posts to plan the perfect feed',
    },
    {
      icon: '👆',
      title: 'Click to preview',
      description: 'See full details, captions & colors',
    },
    {
      icon: '➕',
      title: 'Add new posts',
      description: 'Click empty slots or the + button to add content',
    },
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onDismiss()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onDismiss}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? 'bg-gray-900 scale-110' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="text-5xl mb-4">{steps[step].icon}</div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {steps[step].title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-6">
          {steps[step].description}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 px-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            {step < steps.length - 1 ? 'Next' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  )
}
