import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IG Grid Planner Widget',
  description: 'Instagram Grid Widget for Notion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
