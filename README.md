# kamitsubaki-calender

KAMITSUBAKI Studio event calendar built with React.js and automatic daily updates via GitHub Actions.

## Features

- 🌸 Display events from KAMITSUBAKI Studio artists
- 🔄 Automatic daily updates via GitHub Actions
- 📱 Responsive design for mobile and desktop
- 🎯 Event filtering and search
- 📧 Email notification subscription
- 📊 Event statistics
- 📅 iCal export support
- ⚛️ **NEW:** Built with React.js for better performance and maintainability

## How it works

This calendar solves CORS (Cross-Origin Resource Sharing) issues by using GitHub Actions to fetch event data from external sources and store it locally. The application is now built with React.js for better component organization and state management:

1. **GitHub Action** (`/.github/workflows/update-events.yml`) runs daily at 9:00 AM JST
2. **Fetch Script** (`/scripts/fetch-events.js`) attempts to retrieve latest event data from KAMITSUBAKI's official website
3. **Local Storage** (`/data/events.json`) stores the fetched event data
4. **React Build** The GitHub Action builds the React application and updates the static files
5. **Web Application** (`index.html`) serves the React-powered calendar that loads event data from the local JSON file

## Setup

The application now requires Node.js and npm for development. The built application works out of the box with the provided initial event data. The GitHub Action will automatically update the event data and rebuild the React application daily.

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Manual Testing

To manually run the update script:

```bash
npm install cheerio node-fetch@2
node scripts/fetch-events.js
```

### Building and Deployment

The application is automatically built and deployed via GitHub Actions. For manual deployment:

```bash
# Build the React application
npm run build

# Copy build artifacts to root (for GitHub Pages)
cp dist/index-react.html index.html
cp -r dist/assets assets/
```

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
- `src/components/` - React components (Header, EventCard, CalendarView, etc.)
- `src/App.css` - Styling for the React application
- `package.json` - Node.js dependencies and build scripts
- `vite.config.js` - Vite build configuration

### Legacy & Build
- `index-vanilla.html` - Original vanilla HTML/JS implementation (preserved)
- `index.html` - Built React application (auto-generated)
- `assets/` - Build artifacts (auto-generated)

### Data & Actions
- `.github/workflows/update-events.yml` - GitHub Actions workflow for daily updates and React builds  
- `.github/pull_request_template.md` - Pull request template with screenshot requirements
- `scripts/fetch-events.js` - Node.js script to fetch event data
- `data/events.json` - Local event data storage
- `public/data/events.json` - Public event data for React app

### Configuration
- `.gitignore` - Excludes node_modules and build artifacts (but preserves essential files)

## License

MIT License - see LICENSE file for details.