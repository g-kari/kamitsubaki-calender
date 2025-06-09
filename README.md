# kamitsubaki-calender

KAMITSUBAKI Studio event calendar with automatic daily updates via GitHub Actions.

## Features

- 🌸 Display events from KAMITSUBAKI Studio artists
- 🔄 Automatic daily updates via GitHub Actions
- 📱 Responsive design for mobile and desktop
- 🎯 Event filtering and search
- 📧 Email notification subscription
- 📊 Event statistics
- 📅 iCal export support

## How it works

This calendar solves CORS (Cross-Origin Resource Sharing) issues by using GitHub Actions to fetch event data from external sources and store it locally:

1. **GitHub Action** (`/.github/workflows/update-events.yml`) runs daily at 9:00 AM JST
2. **Fetch Script** (`/scripts/fetch-events.js`) attempts to retrieve latest event data from KAMITSUBAKI's official website
3. **Local Storage** (`/data/events.json`) stores the fetched event data
4. **Web Application** (`index.html`) loads event data from the local JSON file instead of making cross-origin requests

## Setup

The application works out of the box with the provided initial event data. The GitHub Action will automatically update the event data daily.

### Manual Testing

To manually run the update script:

```bash
npm install cheerio node-fetch@2
node scripts/fetch-events.js
```

## Files

- `index.html` - Main web application
- `.github/workflows/update-events.yml` - GitHub Actions workflow for daily updates  
- `scripts/fetch-events.js` - Node.js script to fetch event data
- `data/events.json` - Local event data storage
- `.gitignore` - Excludes node_modules and package files (installed by GitHub Actions)

## License

MIT License - see LICENSE file for details.