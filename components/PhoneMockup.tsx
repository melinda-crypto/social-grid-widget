'use client'

import { ReactNode } from 'react'

interface PhoneMockupProps {
  children: ReactNode
  username?: string
  displayName?: string
  bio?: string
  profilePic?: string
  postsCount?: number
  followersCount?: string
  followingCount?: number
  highlights?: { name: string; image?: string }[]
}

export default function PhoneMockup({
  children,
  username = 'yourbrand',
  displayName = 'Your Brand',
  bio = '✨ Your bio goes here\n📍 Location\n🔗 linktr.ee/yourbrand',
  profilePic,
  postsCount = 127,
  followersCount = '10.2K',
  followingCount = 892,
  highlights = [
    { name: 'About' },
    { name: 'Products' },
    { name: 'Reviews' },
    { name: 'BTS' },
  ],
}: PhoneMockupProps) {
  return (
    <div className="flex justify-center">
      {/* iPhone Frame */}
      <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-20" />

        {/* Screen */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden w-[375px] h-[812px] relative">
          {/* Status Bar */}
          <div className="h-12 bg-white flex items-end justify-between px-8 pb-1">
            <span className="text-xs font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3a9 9 0 019 9h-2a7 7 0 00-7-7V3z"/>
                <path d="M12 7a5 5 0 015 5h-2a3 3 0 00-3-3V7z"/>
                <path d="M12 11a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1z"/>
              </svg>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 17h20v2H2v-2zm2-5h16v2H4v-2zm2-5h12v2H6V7z"/>
              </svg>
              <div className="flex items-center">
                <div className="w-6 h-3 border border-black rounded-sm relative">
                  <div className="absolute inset-0.5 right-1 bg-black rounded-sm" />
                </div>
                <div className="w-0.5 h-1.5 bg-black rounded-r-sm" />
              </div>
            </div>
          </div>

          {/* IG Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">{username}</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          </div>

          {/* Profile Section */}
          <div className="px-4 py-3">
            {/* Profile Header */}
            <div className="flex items-center gap-6">
              {/* Profile Pic */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                      👤
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 flex justify-around">
                <div className="text-center">
                  <div className="font-semibold text-sm">{postsCount}</div>
                  <div className="text-xs text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">{followersCount}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">{followingCount}</div>
                  <div className="text-xs text-gray-500">Following</div>
                </div>
              </div>
            </div>

            {/* Name & Bio */}
            <div className="mt-3">
              <div className="font-semibold text-sm">{displayName}</div>
              <div className="text-xs text-gray-700 whitespace-pre-line mt-1">{bio}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-gray-100 rounded-lg py-1.5 text-xs font-semibold">
                Edit profile
              </button>
              <button className="flex-1 bg-gray-100 rounded-lg py-1.5 text-xs font-semibold">
                Share profile
              </button>
              <button className="bg-gray-100 rounded-lg px-3 py-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>
                </svg>
              </button>
            </div>

            {/* Story Highlights */}
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              {highlights.map((highlight, i) => (
                <div key={i} className="flex flex-col items-center gap-1 min-w-fit">
                  <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-50">
                    {highlight.image ? (
                      <img src={highlight.image} alt={highlight.name} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <span className="text-xl">✨</span>
                    )}
                  </div>
                  <span className="text-[10px]">{highlight.name}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1 min-w-fit">
                <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-[10px]">New</span>
              </div>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex border-t border-gray-100">
            <div className="flex-1 py-3 flex justify-center border-b-2 border-black">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
              </svg>
            </div>
            <div className="flex-1 py-3 flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 py-3 flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Grid Content */}
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: '340px' }}>
            {children}
          </div>

          {/* Bottom Nav Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-8">
            <div className="flex justify-between items-center">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <div className="w-7 h-7 rounded-full bg-gray-300" />
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full" />
        </div>
      </div>
    </div>
  )
}
