/**
 * Console filter to suppress warnings from browser extensions
 * This is optional and only for development purposes
 */

const FILTERED_WARNINGS = [
  'Mixpanel warning',
  'chrome-extension://',
  'PIN Company Discounts',
  'Do Not Track',
];

/**
 * Filters console warnings from browser extensions
 * Use this only in development if you want a cleaner console
 */
export function initConsoleFilter() {
  if (import.meta.env.PROD) {
    return; // Don't filter in production
  }

  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args: unknown[]) => {
    const message = args.join(' ');
    const shouldFilter = FILTERED_WARNINGS.some((filter) =>
      message.includes(filter)
    );

    if (!shouldFilter) {
      originalWarn.apply(console, args);
    }
  };

  console.error = (...args: unknown[]) => {
    const message = args.join(' ');
    const shouldFilter = FILTERED_WARNINGS.some((filter) =>
      message.includes(filter)
    );

    if (!shouldFilter) {
      originalError.apply(console, args);
    }
  };
}

// Uncomment the line below in main.tsx if you want to enable filtering
// initConsoleFilter();
