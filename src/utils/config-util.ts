// Export timeout values from Playwright config
export const TIMEOUTS = {
  action: 1000 * 10, // Default to 10 seconds (from playwright.config.ts)
  assertion: 1000 * 30,
  navigation: 1000 * 30, // Default to 30 seconds (from playwright.config.ts)
  test: 1000 * 120, // Default to 2 minutes (from playwright.config.ts)
};
