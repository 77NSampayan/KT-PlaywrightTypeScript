# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                      # run all tests (default env)
npm run test:headed           # run with browser UI visible
npm run test:debug            # run in Playwright inspector/debug mode
npm run test:report           # open the last HTML report
npm run test:staging          # ENVIRONMENT=staging
npm run test:prod             # ENVIRONMENT=prod
npm run lint                  # eslint . --ext .ts
npm run lint:fix
```

Run a single spec or test: `npx playwright test tests/login-page.spec.ts` or `npx playwright test -g "TC_AP_0001"`.

There is no `tsc` build script; TypeScript is compiled on the fly by Playwright's ts-node integration. Use `npx tsc --noEmit` if you need a standalone type-check.

## Architecture

This is a Playwright + TypeScript Page Object Model (POM) framework (`cline-playwright-ts`). The layered design is: **fixtures → page objects → actions/assertions**, all wired together through path aliases defined in `tsconfig.json`:

- `@fixtures/*` → `src/fixtures/*`
- `@pages/*` → `src/pages/*`
- `@actions/*` → `src/actions/*`
- `@assertions/*` → `src/assertions/*`
- `@app-types/*` → `src/types/*`
- `@constants/*` → `src/resource/constants/*`
- `@utils/*` → `src/utils/*`

### Fixtures (`src/fixtures/base.fixture.ts`)

Tests must import `test` (and `expect`) from `@fixtures/base.fixture`, never directly from `@playwright/test`. This custom fixture extends Playwright's base `test` and injects a `logger` and one fixture per page object (e.g. `loginPage`, `superAdminPage`). Adding a new page object means adding both a fixture entry here and a type in the `TestFixtures` type.

### Page Objects (`src/pages/**`)

Every page object extends `BasePage` (`src/pages/base.page.ts`), which provides:
- Navigation helpers (`goto`, `reload`, `goBack`, `goForward`) that wait for `load` state and log via the injected `Logger`.
- Composed access to `ElementActions` (`this.actions`) and `PageAssertions` (`this.assertions`) — page objects should interact with elements through these, not raw Playwright locators, to keep logging/error-wrapping consistent.
- Page-level assertions (`expectToHaveURL`, `expectToHaveTitle`).

Conventions followed by existing page objects (`login.page.ts`, `sign-up.page.ts`, `admin/superadmin.pages.ts`):
- Constructor signature is always `(page: Page, logger: Logger)`, passed straight to `super()`.
- Locators are declared as `private readonly Locator` class fields, initialized inline via `this.getPage()`.
- Action methods are `async` and `return this` to support chaining.
- UI copy used in locators comes from `TextConstants` (`src/resource/constants/text.constants.ts`), not hardcoded strings.
- `testIdAttribute` is configured as `data-qa` in `playwright.config.ts`, so `getByTestId(...)` looks for `data-qa`, not the Playwright default `data-testid`.

### Actions & Assertions (`src/actions/element.actions.ts`, `src/assertions/*.ts`)

`ElementActions` wraps every common Locator interaction (click, fill, check, hover, drag, wait-for-state, etc.) with try/catch logging and re-thrown errors. `PageAssertions` extends `ElementActions` and wraps Playwright's `expect(locator)`/`expect(page)` matchers the same way, including soft-assertion variants (`expectSoftToBeVisible`, `expectAllSoftToBeVisible`). `GenericAssertions` separately wraps non-DOM `expect()` value matchers (`toBe`, `toEqual`, etc., plus a `.not` namespace). New element interactions or assertions should be added to these central classes rather than inlined in a page object.

Parameter/options types for all of the above are re-derived from Playwright's own method signatures in `src/types/optional-parameter.types.ts` using `Parameters<...>`, instead of being hand-duplicated — follow that pattern when adding new wrapped methods.

### Logging (`src/utils/logger-util.ts`)

`Logger` is a Winston wrapper used everywhere (fixtures, pages, actions, assertions) for `info`/`warn`/`error`/`debug`. It writes to console plus `logs/test-run.log` (all levels) and `logs/error.log` (errors only). The same file also exports `CustomLoggerReporter`, a Playwright reporter registered in `playwright.config.ts`'s `reporter` array — it logs suite/test/step lifecycle events independently of the per-test `Logger` instances created by the fixture.

### Config (`playwright.config.ts`, `src/utils/config-util.ts`)

`playwright.config.ts` loads `.env` via `dotenv` and reads: `BASE_URL`, `SUPER_ADMIN_USERNAME`/`SUPER_ADMIN_PASSWORD` (exported as `superAdminCredentials`), `ENVIRONMENT`, `HEADLESS`, `LOG_LEVEL`, `SLOW_MO`. `src/utils/config-util.ts` exports a `TIMEOUTS` constant (`action`, `assertion`, `navigation`, `test`) intended to mirror the timeouts set in `playwright.config.ts` — keep the two in sync if either changes. Chromium is the only enabled project; other browsers/devices are present but commented out.

### Test conventions (`tests/*.spec.ts`)

- Tests are grouped with `test.describe(...)` and titled `TC_<AREA>_<NUMBER> - <description>`.
- Tests carry a `tag` array in the third argument of `test(...)` (e.g. `{ tag: ['@regression', '@admin'] }`) for filtering with `--grep`/`-g`.
- Shared setup (navigation, logging) belongs in `test.beforeEach`, destructuring the fixtures it needs (`loginPage`, `logger`, etc.) rather than reaching into `@playwright/test` directly.
