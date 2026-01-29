import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export interface SocialPost {
  id: string
  imageUrl: string
  caption?: string
  slot?: number
  name?: string
  status?: 'Draft' | 'Ready' | 'Scheduled' | 'Posted'
  platform?: 'Instagram' | 'TikTok'
  format?: 'Feed Post' | 'Reel' | 'Story' | 'Carousel'
  publishDate?: string
}

// Keep for backward compatibility
export type InstagramPost = SocialPost

export async function getInstagramPosts(): Promise<SocialPost[]> {
  return getSocialPosts()
}

export async function getSocialPosts(sortBy: 'slot' | 'date' = 'slot'): Promise<SocialPost[]> {
  try {
    const dataSourceId = process.env.NOTION_DATABASE_ID

    if (!dataSourceId) {
      throw new Error('NOTION_DATABASE_ID is not set')
    }

    const sortConfig = sortBy === 'date'
      ? [{ property: 'Publish Date', direction: 'ascending' as const }]
      : [{ property: 'IG Slot', direction: 'ascending' as const }]

    const response = await notion.databases.query({
      database_id: dataSourceId,
      sorts: sortConfig,
      page_size: 15, // Get 15 posts for 3x5 grid max
    })

    const posts: SocialPost[] = response.results.map((page: any) => {
      const properties = page.properties

      // Handle file type for Image field OR Canva URL field
      const imageFiles = properties['Image']?.files || []
      const firstImage = imageFiles[0]
      const fileImageUrl = firstImage?.file?.url || firstImage?.external?.url || ''

      // Check for Canva URL or Image URL field as fallback
      const canvaUrl = properties['Canva URL']?.url || properties['Image URL']?.url || ''

      // Prefer uploaded file, fall back to URL
      const imageUrl = fileImageUrl || canvaUrl

      // Handle caption (rich_text type)
      const caption = properties['Caption']?.rich_text?.[0]?.plain_text || ''

      // Handle Slot (number type) - check both 'Slot' and 'IG Slot' for backward compatibility
      const slot = properties['Slot']?.number || properties['IG Slot']?.number || 0

      // Handle Name (title type)
      const name = properties['Name']?.title?.[0]?.plain_text || ''

      // Handle Status (select type)
      const status = properties['Status']?.select?.name || undefined

      // Handle Platform (select type) - defaults to Instagram
      const platform = properties['Platform']?.select?.name || 'Instagram'

      // Handle Format (select type) - Feed Post, Reel, Story, Carousel
      const format = properties['Format']?.select?.name || undefined

      // Handle Publish Date (date type)
      const publishDate = properties['Publish Date']?.date?.start || undefined

      return {
        id: page.id,
        imageUrl,
        caption,
        slot,
        name,
        status,
        platform,
        format,
        publishDate,
      }
    })

    // Filter out posts without images
    return posts.filter(post => post.imageUrl)
  } catch (error) {
    console.error('Error fetching from Notion:', error)
    return []
  }
}

export default notion
