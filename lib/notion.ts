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
}

// Keep for backward compatibility
export type InstagramPost = SocialPost

export async function getInstagramPosts(): Promise<SocialPost[]> {
  return getSocialPosts()
}

export async function getSocialPosts(): Promise<SocialPost[]> {
  try {
    const dataSourceId = process.env.NOTION_DATABASE_ID

    if (!dataSourceId) {
      throw new Error('NOTION_DATABASE_ID is not set')
    }

    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      sorts: [
        {
          property: 'Slot',
          direction: 'ascending',
        },
      ],
      page_size: 9, // Get 9 posts for 3x3 grid
    })

    const posts: SocialPost[] = response.results.map((page: any) => {
      const properties = page.properties

      // Handle file type for Image field
      const imageFiles = properties['Image']?.files || []
      const firstImage = imageFiles[0]
      const imageUrl = firstImage?.file?.url || firstImage?.external?.url || ''

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

      return {
        id: page.id,
        imageUrl,
        caption,
        slot,
        name,
        status,
        platform,
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
