# kamitsubaki-calender

KAMITSUBAKI Studio event calendar with automatic daily updates via GitHub Actions. **Now built with React.js!**

## Features

- 🌸 Display events from KAMITSUBAKI Studio artists
- 🔄 Automatic daily updates via GitHub Actions
- 📱 Responsive design for mobile and desktop
- 🎯 Event filtering and search
- 📧 Browser notification support
- 📊 Event statistics
- 📅 iCal and CSV export support
- ⚛️ Modern React.js interface
- 🚀 Fast Vite build system
- 📦 Component-based architecture

## How it works

This calendar is now a React.js application that solves CORS (Cross-Origin Resource Sharing) issues by using GitHub Actions to fetch event data from external sources and serve it statically:

1. **GitHub Action** (`/.github/workflows/update-events.yml`) runs daily at 9:00 AM JST
2. **Fetch Script** (`/scripts/fetch-events.js`) attempts to retrieve latest event data from KAMITSUBAKI's official website
3. **Local Storage** (`/public/data/events.json`) stores the fetched event data
4. **React Application** loads event data from the local JSON file instead of making cross-origin requests
5. **GitHub Pages** serves the built React application

## Architecture

### React Components
- `App.jsx` - Main application with state management
- `EventsDisplay` - Wrapper for different view modes
- `ListView` - Event list display with cards
- `CalendarView` - Calendar grid interface
- `EventCard` - Individual event card with countdown timer
- `EventModal` - Detailed event information modal

### Build System
- **Vite** - Fast build tool and development server
- **React 18** - Modern React with hooks
- **ESLint** - Code linting
- **CSS** - Original styling preserved

### Deployment
The application builds to static files and deploys automatically to GitHub Pages when event data is updated.

## Setup

### Development

To run the React application locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Event Data Update

To manually update event data:

```bash
npm install cheerio node-fetch@2
node scripts/fetch-events.js
```

The application works out of the box with the provided initial event data. The GitHub Action will automatically update the event data daily and deploy the updated React app to GitHub Pages.

## Contributing

### Pull Request Requirements

**📸 Screenshots Required**

When submitting pull requests that modify the user interface, you **must** include screenshots:

- **Before**: Screenshot showing the current state (if applicable)
- **After**: Screenshot showing your changes (required)

This helps reviewers understand the visual impact of your changes and ensures quality control for the user interface.

The pull request template will guide you through the required information and screenshot format.

### Guidelines

- Follow existing code style and structure
- Test changes across different browsers when possible
- Include appropriate comments for new features
- Ensure responsive design works on mobile and desktop
- **Read the [Screenshot Guide](.github/SCREENSHOT_GUIDE.md)** for detailed instructions on capturing and uploading screenshots

## Files

### React Application
- `src/App.jsx` - Main React application component
- `src/main.jsx` - React application entry point
- `src/index.css` - Global styles (preserved from original)
- `src/App.css` - Component-specific styles
- `index.html` - HTML template for React app
- `package.json` - Node.js dependencies and scripts
- `vite.config.js` - Vite build configuration
- `eslint.config.js` - ESLint configuration

### Data & Deployment
- `.github/workflows/update-events.yml` - GitHub Actions workflow for daily updates and deployment
- `scripts/fetch-events.js` - Node.js script to fetch event data
- `public/data/events.json` - Event data served statically
- `dist/` - Built React application (generated)

### Legacy & Documentation
- `index-original.html` - Original vanilla JavaScript version (preserved for reference)
- `.github/pull_request_template.md` - Pull request template with screenshot requirements
- `.gitignore` - Git ignore configuration

## License

MIT License - see LICENSE file for details.