# TrailMix-Tests (separate test module)

This is a standalone test suite for the TrailMix Angular project. It keeps the project source 100% intact and there is no need to change anything in the `TrailMix` folder. The tests live in this sibling folder and reference the app's source files.


---

## Prerequisites

- Node.js 18+
- A local MongoDB server (e.g. `mongod` running on `mongodb://127.0.0.1:27017`)
- The TrailMix app running locally:
  1. **API:** `cd TrailMix/server && npm i && npm start` (starts on `http://localhost:4000`)
  2. **Client:** `cd TrailMix/client && npm i && npm start` (starts on `http://localhost:4200`)

The server seeds an **admin** and a **demo** user (email: `demo@trailmix.dev`, password: `demopass`) and a few hikes on first run.

> If you keep different paths, update the relative `paths` mapping in `unit/tsconfig.json` and the `baseURL` in `integration/playwright.config.ts` accordingly.

---

## Unit tests (Jest + jest-preset-angular)

1. Open a new terminal:
   ```bash
   cd TrailMix-Tests/unit
   npm i
   npm test         # run all unit tests
   ```

- The unit tests read source files directly from `../TrailMix/client/src/...` (via TypeScript path alias `@project/*`).  
- No changes to the app are required.

---

## Integration (E2E) tests (Playwright)

1. Ensure both the **API** (`:4000`) and **Client** (`:4200`) are running.
2. In a new terminal:
   ```bash
   cd TrailMix-Tests/integration
   npm i
   npx playwright install   # first time only
   npm test                 # run all e2e tests
   ```

- Tests assume the default seed data exists and the app is reachable at `http://localhost:4200`.

---

## What’s covered

**Unit:** pipes, auth & hikes services, and the `auth` route guard.  
**Integration:** smoke load of the catalog, demo-user login, and catalog filtering.
