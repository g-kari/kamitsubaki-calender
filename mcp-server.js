#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { chromium, firefox, webkit } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

class PlaywrightMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'playwright-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.browser = null;
    this.page = null;
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'launch_browser',
            description: 'Launch a browser instance (chromium, firefox, or webkit)',
            inputSchema: {
              type: 'object',
              properties: {
                browserType: {
                  type: 'string',
                  enum: ['chromium', 'firefox', 'webkit'],
                  default: 'chromium',
                  description: 'Type of browser to launch',
                },
                headless: {
                  type: 'boolean',
                  default: true,
                  description: 'Whether to run browser in headless mode',
                },
              },
            },
          },
          {
            name: 'navigate_to_url',
            description: 'Navigate to a specific URL',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL to navigate to',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'take_screenshot',
            description: 'Take a screenshot of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to save the screenshot',
                },
                fullPage: {
                  type: 'boolean',
                  default: false,
                  description: 'Whether to capture the full page',
                },
              },
            },
          },
          {
            name: 'click_element',
            description: 'Click on an element using a selector',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector of the element to click',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'type_text',
            description: 'Type text into an input element',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector of the input element',
                },
                text: {
                  type: 'string',
                  description: 'Text to type',
                },
              },
              required: ['selector', 'text'],
            },
          },
          {
            name: 'get_element_text',
            description: 'Get text content of an element',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector of the element',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'wait_for_element',
            description: 'Wait for an element to appear on the page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector of the element to wait for',
                },
                timeout: {
                  type: 'number',
                  default: 30000,
                  description: 'Timeout in milliseconds',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'run_calendar_test',
            description: 'Run specific tests for the KAMITSUBAKI calendar application',
            inputSchema: {
              type: 'object',
              properties: {
                testType: {
                  type: 'string',
                  enum: ['basic_load', 'navigation', 'events', 'mobile', 'update'],
                  description: 'Type of calendar test to run',
                },
                baseURL: {
                  type: 'string',
                  default: 'http://localhost:5173',
                  description: 'Base URL of the calendar application',
                },
              },
              required: ['testType'],
            },
          },
          {
            name: 'close_browser',
            description: 'Close the browser instance',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'launch_browser':
            return await this.launchBrowser(args.browserType, args.headless);

          case 'navigate_to_url':
            return await this.navigateToUrl(args.url);

          case 'take_screenshot':
            return await this.takeScreenshot(args.path, args.fullPage);

          case 'click_element':
            return await this.clickElement(args.selector);

          case 'type_text':
            return await this.typeText(args.selector, args.text);

          case 'get_element_text':
            return await this.getElementText(args.selector);

          case 'wait_for_element':
            return await this.waitForElement(args.selector, args.timeout);

          case 'run_calendar_test':
            return await this.runCalendarTest(args.testType, args.baseURL);

          case 'close_browser':
            return await this.closeBrowser();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async launchBrowser(browserType = 'chromium', headless = true) {
    const browsers = { chromium, firefox, webkit };
    const selectedBrowser = browsers[browserType];
    
    if (!selectedBrowser) {
      throw new Error(`Unsupported browser type: ${browserType}`);
    }

    this.browser = await selectedBrowser.launch({ headless });
    this.page = await this.browser.newPage();

    return {
      content: [
        {
          type: 'text',
          text: `Successfully launched ${browserType} browser${headless ? ' (headless)' : ''}`,
        },
      ],
    };
  }

  async navigateToUrl(url) {
    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    await this.page.goto(url);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully navigated to: ${url}`,
        },
      ],
    };
  }

  async takeScreenshot(screenshotPath, fullPage = false) {
    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = screenshotPath || `screenshot-${timestamp}.png`;
    const fullPath = path.resolve(fileName);

    await this.page.screenshot({ 
      path: fullPath, 
      fullPage,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Screenshot saved to: ${fullPath}`,
        },
      ],
    };
  }

  async clickElement(selector) {
    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    await this.page.click(selector);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully clicked element: ${selector}`,
        },
      ],
    };
  }

  async typeText(selector, text) {
    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    await this.page.fill(selector, text);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully typed "${text}" into element: ${selector}`,
        },
      ],
    };
  }

  async getElementText(selector) {
    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    const text = await this.page.textContent(selector);
    
    return {
      content: [
        {
          type: 'text',
          text: `Element text: ${text}`,
        },
      ],
    };
  }

  async waitForElement(selector, timeout = 30000) {
    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    await this.page.waitForSelector(selector, { timeout });
    
    return {
      content: [
        {
          type: 'text',
          text: `Element appeared: ${selector}`,
        },
      ],
    };
  }

  async runCalendarTest(testType, baseURL = 'http://localhost:5173') {
    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    const results = [];

    try {
      await this.page.goto(baseURL);
      
      switch (testType) {
        case 'basic_load':
          await this.page.waitForSelector('.container', { timeout: 10000 });
          const title = await this.page.title();
          results.push(`✓ Page loaded successfully with title: ${title}`);
          
          const containerVisible = await this.page.isVisible('.container');
          results.push(`✓ Main container visible: ${containerVisible}`);
          break;

        case 'navigation':
          await this.page.waitForSelector('.container');
          const navButtons = await this.page.locator('button').count();
          results.push(`✓ Found ${navButtons} navigation buttons`);
          
          const viewButtons = await this.page.locator('button').filter({ hasText: /カレンダー|リスト|Calendar|List/i }).count();
          results.push(`✓ Found ${viewButtons} view mode buttons`);
          break;

        case 'events':
          await this.page.waitForSelector('.container');
          await this.page.waitForTimeout(2000); // Wait for events to load
          
          const events = await this.page.locator('.event, .event-card, [data-testid="event"]').count();
          results.push(`✓ Found ${events} event elements`);
          break;

        case 'mobile':
          await this.page.setViewportSize({ width: 375, height: 667 });
          await this.page.waitForSelector('.container');
          
          const bodyWidth = await this.page.evaluate(() => document.body.clientWidth);
          results.push(`✓ Mobile viewport set, body width: ${bodyWidth}px`);
          break;

        case 'update':
          await this.page.waitForSelector('.container');
          
          const updateButton = await this.page.locator('button').filter({ hasText: /更新|Update|🔄/i }).count();
          results.push(`✓ Found ${updateButton} update buttons`);
          break;

        default:
          throw new Error(`Unknown test type: ${testType}`);
      }

    } catch (error) {
      results.push(`✗ Test failed: ${error.message}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Calendar Test Results (${testType}):\n${results.join('\n')}`,
        },
      ],
    };
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }

    return {
      content: [
        {
          type: 'text',
          text: 'Browser closed successfully',
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Playwright MCP Server running on stdio');
  }
}

const server = new PlaywrightMCPServer();
server.run().catch(console.error);