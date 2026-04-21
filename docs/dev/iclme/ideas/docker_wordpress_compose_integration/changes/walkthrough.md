# Walkthrough

## Compose integration

- Read `vendors/wordpress/docker-compose.dev.yml` and copied its service structure into the root `docker-compose.dev.yml`.
- Added `wordpress_db` based on `mariadb:10.11`.
- Added `wordpress` based on `wordpress:latest`.
- Mounted `./vendors/wordpress/wp-content` into the WordPress container.
- Mounted `./vendors/wordpress/setup-headless.sh` into the WordPress container.
- Rewired the root `web` service to use `/workspace/output_as/apps/awkn` as its working directory.
- Changed the root bind mount from `.:/app` to `.:/workspace` so the app service can reach the actual app location.

## Runtime fixes

- Validated the merged compose file with `docker compose config`.
- Started WordPress first to avoid mixing app startup issues with WordPress setup issues.
- Found that `wordpress:latest` does not include the `wp` CLI binary.
- Switched to a `wordpress:cli` helper container to run the setup script.
- Found that WordPress core had not been installed yet, so plugin installation could not succeed.
- Installed local WordPress core with a minimal admin user for the dev environment.
- Found that plugin installation initially failed because `wp-content/upgrade` could not be created.
- Created writable `upgrade` and `uploads` directories and retried plugin installation as `root` in the helper container.
- Found that the root web service failed because `pnpm db:migrate` points to a missing file: `lib/db/migrate.ts`.
- Removed the migration step from the compose startup command so the checked-in app can boot.

## Outcomes

- The root compose now starts these services:
  - `postgres`
  - `web`
  - `wordpress_db`
  - `wordpress`
- Published ports:
  - app: `3005`
  - wordpress: `8080`
  - postgres: `5433`

## WordPress plugin result

Installed and active:

- `wp-graphql`
- `advanced-custom-fields`
- `headless-mode`
- `wordpress-seo`

Requested but not installed from the default WP.org registry:

- `wp-graphql-acf`
- `wp-graphql-smart-cache`
- `wp-graphql-yoast-seo`

## Local access

- Main app: `http://localhost:3005`
- WordPress: `http://localhost:8080`
- Postgres: `localhost:5433`

## Frontend and CMS follow-up

- Reworked the homepage so `/` behaves like a public-facing mission-led website rather than a ServiceGen application grid.
- Replaced ServiceGen-oriented landing copy with Awakening Network content and a cleaner editorial homepage flow.
- Added a distinct header structure with:
  - brand on the left
  - desktop navigation in the middle
  - grouped dropdown menu on the far right
- Added dedicated areas for:
  - intro video
  - resources
  - events
  - contact
  - footer navigation and legal/social placeholders
- Added a WP-CLI seed script at `vendors/wordpress/wp-seed-home-test.sh`.
- Added Makefile targets for WordPress CLI usage and test content seeding:
  - `make wp-shell`
  - `make wp-seed-home-test`
- Verified seeded WordPress content:
  - `Home`
  - `About`
  - `Events`
  - `Contact`
  - `Primary Menu`

## WordPress local admin

- Username: `admin`
- Password: `admin`
