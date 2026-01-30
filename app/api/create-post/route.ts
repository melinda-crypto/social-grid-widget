import { NextRequest, NextResponse } from 'next/server'
import notion from '@/lib/notion'

export async function POST(request: NextRequest) {
  try {
    // Simple auth check
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, imageUrl, caption, format, platform, slot } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const databaseId = process.env.NOTION_DATABASE_ID
    if (!databaseId) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Build properties object
    const properties: Record<string, any> = {
      'Name': {
        title: [{ text: { content: name } }],
      },
    }

    if (imageUrl) {
      properties['Image URL'] = { url: imageUrl }
    }

    if (caption) {
      properties['Caption'] = {
        rich_text: [{ text: { content: caption } }],
      }
    }

    if (format) {
      properties['Format'] = { select: { name: format } }
    }

    if (platform) {
      properties['Platform'] = { select: { name: platform } }
    }

    if (slot !== undefined) {
      properties['IG Slot'] = { number: slot }
    }

    // Default to Draft status
    properties['Status'] = { select: { name: 'Draft' } }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties,
    })

    return NextResponse.json({
      success: true,
      pageId: response.id,
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
