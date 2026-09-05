# Episode Setup Guide - Speak Thai Today

This guide explains how to add new episodes to the website for future videos.

## Quick Overview

The website uses data from JSON metadata files to automatically populate episode information. When you upload a new episode, follow this process to update the website.

## Adding a New Episode

### Step 1: Create Episode Folder & Files

Create a new folder in `episodes/` with the format `ep0X/` (e.g., `episodes/ep02/`)

```
episodes/
├── ep01/
│   ├── index.html (full episode page)
│   ├── metadata.json (episode data)
│   └── transcript.md (full transcript)
└── ep02/
    ├── index.html
    ├── metadata.json
    └── transcript.md
```

### Step 2: Create metadata.json

Copy the template below and fill in your episode data:

```json
{
  "episode": "EP02",
  "title": "Episode Title Here",
  "description": "Brief description of what viewers will learn (2-3 sentences)",
  "publish_date": "2026-09-12",
  "duration_seconds": 400,
  "duration_formatted": "6:40",
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID_HERE",
  "channel": "Speak Thai Today",
  "category": "Thai Category (e.g., Thai Phrases & Expressions)",
  "tags": [
    "thai language",
    "learn thai",
    "add more tags here"
  ],
  "phrases_taught": [
    {
      "english": "English Translation",
      "thai": "ไทย",
      "romanized": "Romanized Version",
      "timing": "0:00–1:00"
    }
  ],
  "learning_outcomes": [
    "Learning outcome 1",
    "Learning outcome 2"
  ],
  "target_audience": "Description of who this is for",
  "status": "published"
}
```

### Step 3: Create Full Episode Page (index.html)

Copy `episodes/ep01/index.html` as your template. Update:

1. **Page Title** (line 7): `<title>EP.0X: Title Here - Speak Thai Today</title>`
2. **Hero Section H1** (around line 234): Episode title and metadata
3. **Phrases Section**: Add all phrases taught with timestamps
4. **Learning Outcomes**: List what viewers will learn
5. **Transcript**: Full transcript with timings
6. **YouTube Link**: Your video URL

### Step 4: Create Transcript (transcript.md)

Create a `transcript.md` file with the full episode transcript in Markdown format. Example:

```markdown
# EP.02: Episode Title

## Video Information
- **Duration**: 6:40
- **Published**: September 12, 2026
- **YouTube**: https://www.youtube.com/watch?v=VIDEO_ID

## Full Transcript

### 0:00 - 0:40 (Introduction)
[Your intro text here]

### 0:40 - 2:00 (First Topic)
[Content here]

### 2:00 - End (Outro)
[Outro text here]
```

### Step 5: Update Main Website (index.html)

Edit the episodes section in `index.html`:

1. **Add New Episode Card** in the episodes grid
2. **Update Links**: 
   - "View Details" → `episodes/ep0X/`
   - "Watch on YouTube" → actual video URL
3. **Update EP02/EP03 Templates** as you release them

Example for new episode:

```html
<article class="episode-card">
    <div class="episode-thumbnail">🎯</div>
    <div class="episode-content">
        <div class="episode-number">EP.02</div>
        <h3 class="episode-title">Episode Title Here</h3>
        <p class="episode-description">Brief description of the episode content goes here.</p>
        <div class="episode-meta">
            <span>⏱️ 6:40</span>
            <span>📅 Sept 12, 2026</span>
        </div>
        <a href="episodes/ep02/" target="_blank" class="episode-link">View Details →</a>
        <a href="https://www.youtube.com/watch?v=VIDEO_ID" target="_blank" class="episode-link" style="margin-left: 1rem;">Watch on YouTube →</a>
    </div>
</article>
```

### Step 6: Update EPISODES.md

Add the new episode to the tracking file:

```markdown
| EP.02 | How to Say Hello Properly | 2026-09-12 | Published | 6:40 | https://www.youtube.com/watch?v=... | [Transcript](episodes/ep02/transcript.md) | [Details](episodes/ep02/) |
```

### Step 7: Commit and Push to GitHub

```bash
git add .
git commit -m "Add EP.02: Episode Title

- Create episode folder with metadata and transcript
- Update main website with new episode card
- Update EPISODES.md tracking file

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

git push origin main
```

## Files to Update for Each New Episode

1. ✅ Create `episodes/ep0X/index.html` - Full episode page
2. ✅ Create `episodes/ep0X/metadata.json` - Episode data
3. ✅ Create `episodes/ep0X/transcript.md` - Full transcript
4. ✅ Update `index.html` - Add episode card
5. ✅ Update `EPISODES.md` - Episode tracking

## Design Notes

- **Emoji Thumbnails**: Each episode has a different emoji in the thumbnail. Choose one that represents the topic.
- **Responsive Design**: All pages work on mobile, tablet, and desktop.
- **GitHub Pages**: Website auto-deploys from main branch. No build step needed.
- **Dark Mode**: Automatic dark mode support for all pages.

## Resources

- YouTube Channel: https://www.youtube.com/@SpeakThaiToday
- Repository: https://github.com/chodnoksujitra/speak-thai-today
- Website: https://chodnoksujitra.github.io/speak-thai-today/

---

**Last Updated**: September 5, 2026
