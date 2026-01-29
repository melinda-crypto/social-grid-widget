# IG Grid Planner Widget

Instagram Grid Widget for Notion - Display your Instagram posts in a beautiful 3×3 grid inside Notion.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create or update `.env.local` with your Notion credentials:

```bash
NOTION_TOKEN=secret_your_integration_token
NOTION_DATABASE_ID=your_database_id
```

**How to get these:**

**NOTION_TOKEN:**
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Find your "IG Grid Planner Widget" integration
3. Copy the "Internal Integration Token"

**NOTION_DATABASE_ID:**
1. Open your Notion database
2. Click the "..." menu → "Copy link"
3. Extract the ID from the URL:
   ```
   https://notion.so/abc123def456?v=...
                  ^^^^^^^^^^^
                  This is your ID
   ```

### 3. Create Your Notion Database

Your database needs these columns:

| Column Name | Type | Required | Description |
|------------|------|----------|-------------|
| Image URL | URL | Yes | Link to Instagram image |
| Post Link | URL | Yes | Link to Instagram post |
| Caption | Text | No | Post caption or description |

**Important:** Share the database with your integration:
1. Open the database
2. Click "..." → "Connections"
3. Add "IG Grid Planner Widget"

### 4. Add Sample Posts

Add a few rows to test:
- **Image URL:** Any Instagram image URL
- **Post Link:** Link to the Instagram post
- **Caption:** Optional description

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. View Your Widget

Visit [http://localhost:3000/widget](http://localhost:3000/widget) to see your Instagram grid.

### 7. Embed in Notion

1. Open your Notion page
2. Type `/embed`
3. Paste: `http://localhost:3000/widget`
4. Press Enter

Your Instagram grid will appear in Notion! 🎉

## 📁 Project Structure

```
ig-notion-widget/
├── app/
│   ├── page.tsx          # Home page with instructions
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   └── widget/
│       └── page.tsx      # Widget page (embeddable)
├── components/
│   └── InstagramGrid.tsx # Grid component
├── lib/
│   └── notion.ts         # Notion API client
├── .env.local            # Environment variables
└── package.json
```

## 🎨 Customization

### Change Grid Size

Edit `lib/notion.ts` line 30:

```typescript
page_size: 9, // Change to 6 for 2×3, or 12 for 3×4
```

### Adjust Styling

Edit `components/InstagramGrid.tsx`:
- Line 32: Change `gap-2` to `gap-4` for more spacing
- Line 41: Change `rounded-lg` to `rounded-xl` for more rounding
- Customize colors, hover effects, etc.

## 🚀 Deploy to Production

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Your widget URL will be: `https://yourapp.vercel.app/widget`

### Option 2: Any Node.js Host

```bash
npm run build
npm start
```

## 🔧 Troubleshooting

**No posts showing?**
- Check your `.env.local` has correct values
- Verify database is shared with the integration
- Check column names match (case-sensitive)
- Look at terminal for error messages

**Widget not embedding in Notion?**
- Notion only embeds PUBLIC URLs
- Use `localhost` for testing
- Deploy to see it in Notion properly

**Images not loading?**
- Check Image URLs are valid and public
- Instagram CDN URLs may expire - consider uploading to your own storage

## 📝 Next Steps

- Add Instagram OAuth for automatic syncing
- Add license key system for monetization
- Create customer dashboard
- Add multiple layout options
- Cache posts for faster loading

## 💬 Support

Questions? Contact: melinda@maidigital.co

---

Built with Next.js, Notion API, and Tailwind CSS
