'use client'

import { useEffect } from 'react'

interface CheckoutButtonProps {
  className?: string
  children: React.ReactNode
}

declare global {
  interface Window {
    createLemonSqueezy?: () => void
    LemonSqueezy?: {
      Url: {
        Open: (url: string) => void
      }
    }
  }
}

export default function CheckoutButton({ className, children }: CheckoutButtonProps) {
  useEffect(() => {
    // Load Lemon Squeezy script
    const script = document.createElement('script')
    script.src = 'https://assets.lemonsqueezy.com/lemon.js'
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.createLemonSqueezy) {
        window.createLemonSqueezy()
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleCheckout = () => {
    const checkoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL

    if (checkoutUrl && window.LemonSqueezy) {
      window.LemonSqueezy.Url.Open(checkoutUrl)
    } else if (checkoutUrl) {
      // Fallback to direct link if overlay doesn't load
      window.location.href = checkoutUrl
    } else {
      console.error('Checkout URL not configured')
      alert('Checkout is being set up. Please try again shortly.')
    }
  }

  return (
    <button
      onClick={handleCheckout}
      className={className}
    >
      {children}
    </button>
  )
}
