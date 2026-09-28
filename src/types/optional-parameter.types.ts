import { Page, Locator, expect } from '@playwright/test';

// Common options type for many Playwright actions and assertions
export type TimeoutOption = {
  timeout?: number;
};

export type LocatorMatcher = ReturnType<typeof expect<Locator>>;
export type PageMatcher = ReturnType<typeof expect<Page>>;

// Re-exporting Playwright's parameter types for clarity and central access
// Page Action Parameters
export type GotoOptions = Parameters<Page['goto']>[1];
export type ReloadOptions = Parameters<Page['reload']>[0];
export type PageWaitForTimeoutOptions = Parameters<Page['waitForTimeout']>[0]; // For consistency, though it's just a number
export type PageWaitForLoadState = Parameters<Page['waitForLoadState']>[1]; // For consistency, though it's just a number

// Locator Action Parameters
export type ClickOptions = Parameters<Locator['click']>[0];
export type FillOptions = Parameters<Locator['fill']>[1];
export type ClearOptions = Parameters<Locator['clear']>[0];
export type TypeOptions = Parameters<Locator['type']>[1];
export type CheckOptions = Parameters<Locator['check']>[0];
export type UncheckOptions = Parameters<Locator['uncheck']>[0];
export type SelectOptionOptions = Parameters<Locator['selectOption']>[1];
export type HoverOptions = Parameters<Locator['hover']>[0];
export type FocusOptions = Parameters<Locator['focus']>[0];
export type DragToOptions = Parameters<Locator['dragTo']>[1];
export type WaitForOptions = Parameters<Locator['waitFor']>[0];

// Page Assertion Parameters
// The options parameter is typically the second argument for page assertions.
export type PageToHaveURLOptions = Parameters<PageMatcher['toHaveURL']>[1]; // Parameters<PageAssertions['toHaveURL']>[1] simplifies to this
export type PageToHaveTitleOptions = Parameters<PageMatcher['toHaveTitle']>[1]; // Parameters<PageAssertions['toHaveTitle']>[1] simplifies to this

// Locator Assertion Parameters
// The options parameter is typically the second argument for locator assertions.
export type ToBeVisibleOptions = Parameters<LocatorMatcher['toBeVisible']>[0]; // Parameters<LocatorAssertions['toBeVisible']>[0] simplifies to this
export type ToBeHiddenOptions = Parameters<LocatorMatcher['toBeHidden']>[0]; // Parameters<LocatorAssertions['toBeHidden']>[0] simplifies to this
export type ToHaveTextOptions = Parameters<LocatorMatcher['toHaveText']>[1]; // Parameters<LocatorAssertions['toHaveText']>[1] simplifies to this
export type ToContainTextOptions = Parameters<LocatorMatcher['toContainText']>[1]; // Parameters<LocatorAssertions['toContainText']>[1] simplifies to this
// For toHaveAttribute, options is the 2nd parameter.
export type ToHaveAttributeOptions = Parameters<LocatorMatcher['toHaveAttribute']>[1]; // Parameters<LocatorAssertions['toHaveAttribute']>[1] simplifies to this
export type ToHaveClassOptions = Parameters<LocatorMatcher['toHaveClass']>[1]; // Parameters<LocatorAssertions['toHaveClass']>[1] simplifies to this
export type ToContainClassOptions = Parameters<LocatorMatcher['toContainClass']>[1]; // Parameters<LocatorAssertions['toContainClass']>[1] simplifies to this

// New Locator Assertion Parameters
export type ToBeAttachedOptions = Parameters<LocatorMatcher['toBeAttached']>[0];
export type ToBeCheckedOptions = Parameters<LocatorMatcher['toBeChecked']>[0];
export type ToBeDisabledOptions = Parameters<LocatorMatcher['toBeDisabled']>[0];
export type ToBeEditableOptions = Parameters<LocatorMatcher['toBeEditable']>[0];
export type ToBeEmptyOptions = Parameters<LocatorMatcher['toBeEmpty']>[0];
export type ToBeEnabledOptions = Parameters<LocatorMatcher['toBeEnabled']>[0];
export type ToBeFocusedOptions = Parameters<LocatorMatcher['toBeFocused']>[0];
export type ToBeInViewportOptions = Parameters<LocatorMatcher['toBeInViewport']>[0];
export type ToHaveAccessibleDescriptionOptions = Parameters<LocatorMatcher['toHaveAccessibleDescription']>[1];
export type ToHaveAccessibleNameOptions = Parameters<LocatorMatcher['toHaveAccessibleName']>[1];
export type ToHaveCSSOptions = Parameters<LocatorMatcher['toHaveCSS']>[2];
export type ToHaveIdOptions = Parameters<LocatorMatcher['toHaveId']>[1];
export type ToHaveJSPropertyOptions = Parameters<LocatorMatcher['toHaveJSProperty']>[2];
export type ToHaveRoleOptions = Parameters<LocatorMatcher['toHaveRole']>[1];
export type ToHaveValueOptions = Parameters<LocatorMatcher['toHaveValue']>[1];
export type ToHaveValuesOptions = Parameters<LocatorMatcher['toHaveValues']>[1];

// ARIA Role type for accessibility assertions
export type ARIARole = Parameters<LocatorMatcher['toHaveRole']>[0];

// Note: Screenshot and AriaSnapshot assertions are more complex and are omitted for now as they are less common in this type of wrapper.

// Locator Value Getter Parameters
export type TextContentOptions = Parameters<Locator['textContent']>[0];
export type GetAttributeOptions = Parameters<Locator['getAttribute']>[1];
export type InputValueOptions = Parameters<Locator['inputValue']>[0];

// Wait methods
