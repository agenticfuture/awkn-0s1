# Notes

- Merged the vendor WordPress services into the root `docker-compose.dev.yml`.
- Rewired the root app service to run from `output_as/apps/awkn` without copying the app folder.
- Corrected the web container startup command after discovering the checked-in app does not contain `lib/db/migrate.ts`.
- Installed and activated the WordPress plugins that were available from the default WordPress plugin registry.
- Recorded the implementation plan and walkthrough in the `changes/` folder for future reference.
- Extended the implementation plan to cover a headless WordPress backend with a fully custom frontend, locale-aware fetchers, and adapters.
- Added a repeatable WP-CLI bootstrap path through Docker and the project `Makefile`.
- Seeded test WordPress content for `Home`, `About`, `Events`, `Contact`, plus a `Primary Menu`.
