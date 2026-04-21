# Implementation Plan

1. Review the vendor WordPress compose file, the root compose file, and the WordPress setup script.
2. Merge the WordPress `db` and `wordpress` services into the root `docker-compose.dev.yml`.
3. Rewire the root app service so it runs from `output_as/apps/awkn` instead of assuming the app lives at the repo root.
4. Start the WordPress services first.
5. Run the WordPress setup script to install and activate the requested plugins.
6. Start the full stack from the root compose file.
7. Verify container status and report the local URLs for the app and WordPress.

## Headless CMS Extension

8. Keep the frontend fully custom in Next.js and use WordPress only as the backend content system.
9. Do not wire the frontend loosely to raw WordPress pages; instead define a content schema and consume it through:
   - locale-aware fetchers
   - adapters
   - typed frontend models
10. Configure WordPress to own:
   - pages
   - menus
   - global settings
   - resources
   - events
   - footer/legal content
   - translations for English and French
11. Configure the frontend to own:
   - page layout
   - visual design
   - motion
   - responsive behavior
   - component composition
12. Use WP-CLI through Docker helper containers for repeatable automation:
   - page creation
   - menu creation
   - front-page assignment
   - test content seeding
13. Store repeatable WordPress bootstrap commands in the project `Makefile` so local setup and reseeding are fast and predictable.
