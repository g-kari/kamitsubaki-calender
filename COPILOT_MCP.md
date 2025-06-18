# GitHub Copilot Playwright MCP Integration

This repository is configured to work with GitHub Copilot using Playwright MCP (Model Context Protocol) for browser automation and testing.

## Available MCP Tools

The Playwright MCP server provides the following tools for GitHub Copilot:

### Browser Control
- `launch_browser` - Launch a browser (chromium, firefox, webkit)
- `navigate_to_url` - Navigate to a specific URL
- `close_browser` - Close the browser instance

### Page Interaction
- `click_element` - Click on elements using CSS selectors
- `type_text` - Type text into input fields
- `get_element_text` - Get text content from elements
- `wait_for_element` - Wait for elements to appear

### Testing & Screenshots
- `take_screenshot` - Capture page screenshots
- `run_calendar_test` - Run specific tests for the calendar app

## Usage Examples

### Starting the MCP Server
```bash
npm run mcp-server
```

### Running Playwright Tests
```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm test:headed

# Debug tests interactively
npm test:debug

# Run tests with UI
npm test:ui

# View test report
npm test:report
```

## Calendar-Specific Tests

The MCP server includes calendar-specific test functions:

- `basic_load` - Test basic page loading
- `navigation` - Test calendar navigation
- `events` - Test event display
- `mobile` - Test mobile responsiveness  
- `update` - Test update functionality

## GitHub Copilot Integration

With this setup, GitHub Copilot can:

1. **Automated Testing**: Run browser tests and validate functionality
2. **Screenshot Generation**: Take screenshots for documentation or bug reports
3. **UI Interaction**: Click buttons, fill forms, navigate the application
4. **Responsive Testing**: Test different viewport sizes
5. **Event Validation**: Verify calendar events are displayed correctly

## Configuration

The MCP configuration is stored in `.mcp-config.json` and the Playwright configuration is in `playwright.config.js`.

## Example Copilot Commands

Ask GitHub Copilot to:
- "Take a screenshot of the calendar in mobile view"
- "Test if the update button works"
- "Check if events are displaying properly"
- "Run all calendar tests and show results"
- "Verify the navigation between months works"

The MCP server will handle the browser automation and provide results back to Copilot.