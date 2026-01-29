# Repository Guidelines

## Project Structure & Module Organization
- `frontend/` hosts the Next.js app: routes live in `frontend/src/app`, shared UI in `frontend/src/components`, hooks in `frontend/src/hooks`, API helpers in `frontend/src/lib/api`, and static assets in `frontend/public`.
- `backend/` is the Spring Boot service: Java source in `backend/src/main/java/com/fashon`, resources in `backend/src/main/resources`, tests in `backend/src/test/java`, and file uploads in `backend/uploads`.
- `database/` contains SQL Server scripts: `01_init_database.sql` (schema) and `02_seed_data.sql` (seed data).
- `docs/` holds project notes and planning artifacts.

## Build, Test, and Development Commands
Frontend (from `frontend/`):
- `npm run dev` - start the Next.js dev server at http://localhost:3000.
- `npm run build` - produce a production build.
- `npm run start` - serve the production build.
- `npm run lint` - run ESLint (Next core-web-vitals + TypeScript).

Backend (from `backend/`):
- `mvn spring-boot:run` - start the API on port 8080.
- `mvn test` - run unit and integration tests.
- `mvn clean package` - build the runnable jar.

Database:
- Run `database/01_init_database.sql` then `database/02_seed_data.sql` against SQL Server.

## Coding Style & Naming Conventions
- Frontend: TypeScript/React with 2-space indentation; components use PascalCase, hooks use `useX`, and routes live under `src/app`. Use the `@/` path alias.
- Backend: Java with 4-space indentation; packages are lowercase (`com.fashon`), classes are PascalCase, controllers end with `Controller`, services with `Service`, repositories with `Repository`, and DTOs with `Request` or `DTO`.
- Follow ESLint (`frontend/eslint.config.mjs`) and existing local formatting in neighboring files.

## Testing Guidelines
- Backend uses Spring Boot starter test (JUnit 5). Place tests in `backend/src/test/java` and name them `*Test`.
- Frontend has no test runner configured yet; if you add one, include scripts in `frontend/package.json` and keep tests close to components (for example `Button.test.tsx`).

## Commit & Pull Request Guidelines
- Commit history follows conventional commits (for example `feat:`, `fix:`); keep messages short and imperative.
- PRs should describe the change, list testing performed, link related issues, and include UI screenshots for frontend changes.

## Security & Configuration Tips
- Configure database and JWT settings in `backend/src/main/resources/application.yml`; prefer env overrides like `JWT_SECRET` and `JWT_EXPIRATION` for secrets.
- Do not commit real credentials or large upload artifacts from `backend/uploads`.
