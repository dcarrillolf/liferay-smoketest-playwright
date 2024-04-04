# Liferay SmokeTests

## What to expect?
- Docker-compose basic setup
- Playwight tests for simple Liferay Smoke Tests

## How-to
### Starting up server
1. Adapt **docker-compose.yml** to your needs.
2. *(Optional)* Add the patch into **docker/liferay/patching**
3. `docker-compose up`

### Running Tests
1. Adapt **playwright.config.ts** if needed.
2. Adapt **tests/\*.test.ts** if needed.
3. `npm install`
4. `npx playwright test tests/2024q1.test.ts --ui`
