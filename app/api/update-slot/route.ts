import { NextRequest, NextResponse } from 'next/server'
import notion from '@/lib/notion'

export async function POST(request: NextRequest) {
  try {
    // Simple auth check - prevents random API calls
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pageId, slot } = await request.json()

    if (!pageId || slot === undefined) {
      return NextResponse.json({ error: 'Missing pageId or slot' }, { status: 400 })
    }

    await notion.pages.update({
      page_id: pageId,
      properties: {
        'IG Slot': {
          number: slot,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating slot:', error)
    return NextResponse.json({ error: 'Failed to update slot' }, { status: 500 })
  }
}
