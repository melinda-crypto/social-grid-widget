import { NextRequest, NextResponse } from 'next/server'
import notion from '@/lib/notion'

export async function POST(request: NextRequest) {
  try {
    // Simple auth check
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pageId, caption, status, hashtags } = await request.json()

    if (!pageId) {
      return NextResponse.json({ error: 'Missing pageId' }, { status: 400 })
    }

    // Build properties object with only the fields that were provided
    const properties: Record<string, any> = {}

    if (caption !== undefined) {
      properties['Caption'] = {
        rich_text: caption ? [{ text: { content: caption } }] : [],
      }
    }

    if (status !== undefined) {
      properties['Status'] = {
        select: status ? { name: status } : null,
      }
    }

    if (hashtags !== undefined) {
      properties['Hashtags'] = {
        rich_text: hashtags ? [{ text: { content: hashtags } }] : [],
      }
    }

    // Only update if there are properties to update
    if (Object.keys(properties).length === 0) {
      return NextResponse.json({ error: 'No properties to update' }, { status: 400 })
    }

    await notion.pages.update({
      page_id: pageId,
      properties,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}
