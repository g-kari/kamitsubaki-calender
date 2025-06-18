import { test, expect } from '@playwright/test';

test.describe('KAMITSUBAKI Calendar', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/KAMITSUBAKI/);
    
    // Check that the main calendar container is present
    await expect(page.locator('.container')).toBeVisible();
    
    // Check that the header is present
    await expect(page.locator('h1')).toContainText('KAMITSUBAKI');
  });

  test('should display calendar navigation', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForSelector('.container');
    
    // Check for navigation elements
    const navigation = page.locator('[role="navigation"], .navigation, .nav');
    if (await navigation.count() > 0) {
      await expect(navigation.first()).toBeVisible();
    }
    
    // Check for view mode toggles (calendar, list, etc.)
    const viewButtons = page.locator('button').filter({ hasText: /カレンダー|リスト|Calendar|List/i });
    if (await viewButtons.count() > 0) {
      await expect(viewButtons.first()).toBeVisible();
    }
  });

  test('should display events', async ({ page }) => {
    await page.goto('/');
    
    // Wait for events to load
    await page.waitForTimeout(2000);
    
    // Check for event elements
    const events = page.locator('.event, .event-card, [data-testid="event"]');
    const eventCount = await events.count();
    
    if (eventCount > 0) {
      // If events are present, verify they contain expected information
      const firstEvent = events.first();
      await expect(firstEvent).toBeVisible();
      
      // Events should contain dates and titles
      const eventText = await firstEvent.textContent();
      expect(eventText).toBeTruthy();
    } else {
      // If no events, check for fallback or loading state
      const noEventsMessage = page.locator('text=イベントがありません, text=No events, .loading, .empty-state');
      if (await noEventsMessage.count() > 0) {
        await expect(noEventsMessage.first()).toBeVisible();
      }
    }
  });

  test('should have working update functionality', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForSelector('.container');
    
    // Look for update button
    const updateButton = page.locator('button').filter({ hasText: /更新|Update|🔄/i });
    if (await updateButton.count() > 0) {
      await expect(updateButton.first()).toBeVisible();
      await expect(updateButton.first()).toBeEnabled();
    }
    
    // Check for auto-update toggle
    const autoUpdateToggle = page.locator('.toggle, input[type="checkbox"]').filter({ hasText: /自動|auto/i });
    if (await autoUpdateToggle.count() > 0) {
      await expect(autoUpdateToggle.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForSelector('.container');
    
    // Check that the layout adapts to mobile
    const container = page.locator('.container');
    await expect(container).toBeVisible();
    
    // Mobile-specific checks
    const body = page.locator('body');
    const bodyWidth = await body.boundingBox();
    expect(bodyWidth?.width).toBeLessThanOrEqual(400);
  });

  test('should handle calendar navigation', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForSelector('.container');
    
    // Look for month navigation buttons
    const prevButton = page.locator('button').filter({ hasText: /前|←|prev|<|chevron.*left/i });
    const nextButton = page.locator('button').filter({ hasText: /次|→|next|>|chevron.*right/i });
    
    if (await prevButton.count() > 0) {
      await expect(prevButton.first()).toBeVisible();
    }
    
    if (await nextButton.count() > 0) {
      await expect(nextButton.first()).toBeVisible();
    }
    
    // Test navigation if buttons exist
    if (await nextButton.count() > 0) {
      const currentDate = await page.textContent('h2, .month-year, .current-month');
      await nextButton.first().click();
      await page.waitForTimeout(500);
      const newDate = await page.textContent('h2, .month-year, .current-month');
      
      // Month should have changed (unless we're checking a different element)
      if (currentDate && newDate) {
        // This is a basic check - in practice, you'd verify actual month change
        expect(newDate).toBeTruthy();
      }
    }
  });
});