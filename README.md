# ParkSpot

Monthly car parking platform built with Vue 3, Vuex 4, and Vite.

## Prerequisites

```
Node >= 22.12.0 (see .nvmrc)
npm  >= 10
```

Use [nvm](https://github.com/nvm-sh/nvm) to switch to the correct version:

```bash
nvm use
```

## Project Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

App runs at http://parkspot.localhost:8080/. Add a hosts entry:

**macOS/Linux:**
```
127.0.0.1  parkspot.localhost
```
Add the line above to `/etc/hosts`.

**Windows:**
Edit `C:\Windows\System32\drivers\etc\hosts` and add the same line.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | SSG build + sitemap + verification |
| `npm run serve` | Preview production build |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier formatting |
| `npm run test` | Vitest in watch mode (all projects) |
| `npm run test:unit` | Run unit tests once (jsdom) |
| `npm run test:visual` | Run visual regression tests (Playwright/Chromium) |
| `npm run test:visual:update` | Update visual test baseline screenshots |
| `npm run coverage` | Unit test coverage report |

## Testing

The project uses two Vitest projects configured in `vite.config.js`:

### Unit Tests

Fast jsdom-based tests under `tests/`.

```bash
npm run test:unit
```

### Visual Regression Tests

Browser-based screenshot tests using Playwright + headless Chromium. Tests live under `tests/visual/`.

```bash
# Run visual tests (compares against committed baselines)
npm run test:visual

# Update baselines after intentional UI changes
npm run test:visual:update
```

**How it works:**
- `tests/visual/components-smoke.visual.spec.js` auto-discovers all `.vue` components and screenshots them with default/empty props.
- `tests/visual/templates/` contains hand-crafted specs for critical pages with multiple render states.
- `tests/visual/skip-list.js` lists components that can't be screenshotted in isolation (3rd-party SDKs, auth-gated, etc).
- `tests/visual/test-helpers.js` provides a fake Vuex store, fake router, and Buefy stubs.

**Updating screenshots:**
1. Make your UI change
2. Run `npm run test:visual:update`
3. Review the diff in `tests/visual/__screenshots__/`
4. Commit the updated `.png` baselines

**Adding a component to the skip-list:**
If a new component can't mount in isolation, add it to `tests/visual/skip-list.js` with a reason.

### Coverage

```bash
npm run coverage
```

Generates reports in `coverage/`. CI enforces minimum thresholds (see `.github/workflows/pr-test.yml`).

## CI / GitHub Actions

PR workflow (`.github/workflows/pr-test.yml`) runs on every PR to `master`:

1. **Lint** — ESLint
2. **Build** — SSG build verification
3. **Unit Tests** — `npm run test:unit`
4. **Visual Tests** — `npm run test:visual` (installs Playwright in CI)
5. **Coverage** — enforces threshold gates

All jobs must pass for merge.

## Tech Stack

- **Vue 3** + Vuex 4 + Vue Router 4
- **Vite** + vite-ssg (static site generation)
- **Buefy** (Bulma-based component library)
- **Vitest** (unit + visual testing)
- **Playwright** (visual test browser automation)
- **@unhead/vue** (head/meta management via vite-ssg)
- **Firebase** (auth)
- **Mapbox GL** (maps)

## Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Vitest Docs](https://vitest.dev/)
- [Vite SSG](https://github.com/antfu/vite-ssg)
