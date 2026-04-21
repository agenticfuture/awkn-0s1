-include .env.local

COMPOSE := docker compose -f docker-compose.dev.yml
WPCLI := docker run --rm --network awkn-0s1_default --volumes-from awkn-wordpress-dev -v $(CURDIR)/vendors/wordpress:/workspace -e WORDPRESS_DB_HOST=wordpress_db:3306 -e WORDPRESS_DB_NAME=wordpress -e WORDPRESS_DB_USER=wp_user -e WORDPRESS_DB_PASSWORD=wp_password -e AWKN_YOUTUBE_CHANNEL_ID_EN="$(AWKN_YOUTUBE_CHANNEL_ID_EN)" -e AWKN_YOUTUBE_CHANNEL_ID_FR="$(AWKN_YOUTUBE_CHANNEL_ID_FR)" -e AWKN_YOUTUBE_FEED_LIMIT="$(AWKN_YOUTUBE_FEED_LIMIT)" wordpress:cli

.PHONY: help up down restart logs ps build install migrate shell db-shell clean wp-shell wp-seed-home-test wp-install-commerce wp-seed-media-test wp-sync-media-feed

help:
	@echo "Targets:"
	@echo "  make up        Start Postgres and the Next.js app"
	@echo "  make down      Stop the stack"
	@echo "  make restart   Restart the stack"
	@echo "  make logs      Follow container logs"
	@echo "  make ps        Show running services"
	@echo "  make build     Pull/build images as needed"
	@echo "  make install   Install dependencies in the web container"
	@echo "  make migrate   Run database migrations in the web container"
	@echo "  make shell     Open a shell in the web container"
	@echo "  make db-shell  Open psql in the Postgres container"
	@echo "  make wp-shell  Open a shell in a WP-CLI helper container"
	@echo "  make wp-seed-home-test  Create Home/About/Events/Contact pages and a primary menu in WordPress"
	@echo "  make wp-seed-media-test  Seed localized media entries in WordPress"
	@echo "  make wp-sync-media-feed  Run the media feed sync scaffold in WordPress"
	@echo "  make wp-install-commerce  Install WooCommerce and the Stripe gateway in WordPress"
	@echo "  make clean     Stop the stack and remove named volumes"

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

build:
	$(COMPOSE) build

install:
	$(COMPOSE) run --rm web bash -lc "corepack enable && pnpm install"

migrate:
	$(COMPOSE) run --rm web bash -lc "corepack enable && pnpm db:migrate"

shell:
	$(COMPOSE) exec web bash

db-shell:
	$(COMPOSE) exec postgres psql -U awkn -d awkn

wp-shell:
	$(WPCLI) sh

wp-seed-home-test:
	$(WPCLI) sh /workspace/wp-seed-home-test.sh

wp-seed-media-test:
	$(WPCLI) sh /workspace/wp-seed-home-test.sh

wp-sync-media-feed:
	$(WPCLI) sh /workspace/wp-sync-media-feed.sh

wp-install-commerce:
	$(WPCLI) wp plugin install woocommerce woocommerce-gateway-stripe --activate --path=/var/www/html --allow-root

clean:
	$(COMPOSE) down -v
