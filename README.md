# Liferay SmokeTests

## What to expect?
- Docker-compose basic setup
- Playwight tests for simple Liferay Smoke Tests *"test.only(...)"*
 

## How-to
### Starting up server
1. Adapt **docker-compose.yml** to your needs.
2. Create docker/.env file
```
IMAGE_LIFERAY=liferay/dxp:2024.q1.1
```
3. Add the patch into **docker/liferay/patching**
4. `docker-compose up`

### Running Tests
1. Adapt **playwright.config.ts** if needed.
2. Adapt **tests/\*.test.ts** if needed.
3. `npm install` 
4. `npx playwright test --ui`

