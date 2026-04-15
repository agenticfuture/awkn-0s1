COMPOSE := docker compose -f docker-compose.dev.yml

.PHONY: help up down restart logs ps build install migrate shell db-shell clean

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

clean:
	$(COMPOSE) down -v
