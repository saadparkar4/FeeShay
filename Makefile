# =============================================================================
# FeeShay Project Makefile
# =============================================================================
# This Makefile provides convenient commands for common development and
# deployment tasks for the FeeShay freelance marketplace platform.
#
# Usage: make [target]
# Example: make dev-start
# =============================================================================

# =============================================================================
# VARIABLES
# =============================================================================
PROJECT_NAME := feeshay
COMPOSE_FILE := docker-compose.yml
COMPOSE_DEV_FILE := docker-compose.override.yml

# Docker image tags
BACKEND_IMAGE := $(PROJECT_NAME)-backend
FRONTEND_IMAGE := $(PROJECT_NAME)-frontend

# Directories
BACKEND_DIR := Backend
FRONTEND_DIR := Frontend
DATA_DIR := data

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# =============================================================================
# HELP TARGET (Default)
# =============================================================================
.PHONY: help
help: ## Display this help message
	@echo "$(BLUE)FeeShay Development & Deployment Commands$(NC)"
	@echo "========================================"
	@echo ""
	@echo "$(YELLOW)Development Commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -v "Production\|Docker\|Database" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Docker Commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep "Docker" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Database Commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep "Database" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Production Commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep "Production" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# =============================================================================
# DEVELOPMENT COMMANDS
# =============================================================================
.PHONY: install
install: ## Install dependencies for both frontend and backend
	@echo "$(BLUE)Installing dependencies...$(NC)"
	cd $(BACKEND_DIR) && npm install
	cd $(FRONTEND_DIR) && npm install
	@echo "$(GREEN)Dependencies installed successfully!$(NC)"

.PHONY: dev-start
dev-start: ## Start development servers (backend and frontend)
	@echo "$(BLUE)Starting development servers...$(NC)"
	@echo "$(YELLOW)Backend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:19006$(NC)"
	@$(MAKE) -j2 dev-backend dev-frontend

.PHONY: dev-backend
dev-backend: ## Start backend development server
	@echo "$(BLUE)Starting backend development server...$(NC)"
	cd $(BACKEND_DIR) && npm start

.PHONY: dev-frontend
dev-frontend: ## Start frontend development server
	@echo "$(BLUE)Starting frontend development server...$(NC)"
	cd $(FRONTEND_DIR) && npm start

.PHONY: dev-ios
dev-ios: ## Open iOS simulator for frontend development
	@echo "$(BLUE)Opening iOS simulator...$(NC)"
	cd $(FRONTEND_DIR) && npx expo start --ios

.PHONY: dev-android
dev-android: ## Open Android emulator for frontend development
	@echo "$(BLUE)Opening Android emulator...$(NC)"
	cd $(FRONTEND_DIR) && npx expo start --android

.PHONY: dev-web
dev-web: ## Open web browser for frontend development
	@echo "$(BLUE)Opening web browser...$(NC)"
	cd $(FRONTEND_DIR) && npx expo start --web

.PHONY: lint
lint: ## Run linting for both frontend and backend
	@echo "$(BLUE)Running linters...$(NC)"
	cd $(BACKEND_DIR) && npm run lint || true
	cd $(FRONTEND_DIR) && npm run lint || true
	@echo "$(GREEN)Linting completed!$(NC)"

.PHONY: test
test: ## Run tests for backend
	@echo "$(BLUE)Running tests...$(NC)"
	cd $(BACKEND_DIR) && npm test
	@echo "$(GREEN)Tests completed!$(NC)"

.PHONY: test-coverage
test-coverage: ## Run tests with coverage report
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	cd $(BACKEND_DIR) && npm run test:coverage
	@echo "$(GREEN)Tests with coverage completed!$(NC)"

.PHONY: clean
clean: ## Clean node_modules and build artifacts
	@echo "$(BLUE)Cleaning project...$(NC)"
	rm -rf $(BACKEND_DIR)/node_modules
	rm -rf $(FRONTEND_DIR)/node_modules
	rm -rf $(BACKEND_DIR)/dist
	rm -rf $(FRONTEND_DIR)/.expo
	@echo "$(GREEN)Project cleaned!$(NC)"

# =============================================================================
# DOCKER COMMANDS
# =============================================================================
.PHONY: docker-build
docker-build: ## Docker: Build all images
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker-compose build
	@echo "$(GREEN)Docker images built successfully!$(NC)"

.PHONY: docker-up
docker-up: ## Docker: Start all services
	@echo "$(BLUE)Starting Docker services...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Docker services started!$(NC)"
	@echo "$(YELLOW)Backend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)MongoDB Express: http://localhost:8081$(NC)"

.PHONY: docker-up-dev
docker-up-dev: ## Docker: Start all services in development mode
	@echo "$(BLUE)Starting Docker services in development mode...$(NC)"
	docker-compose --profile development up -d
	@echo "$(GREEN)Docker development services started!$(NC)"

.PHONY: docker-down
docker-down: ## Docker: Stop all services
	@echo "$(BLUE)Stopping Docker services...$(NC)"
	docker-compose down
	@echo "$(GREEN)Docker services stopped!$(NC)"

.PHONY: docker-restart
docker-restart: ## Docker: Restart all services
	@echo "$(BLUE)Restarting Docker services...$(NC)"
	docker-compose restart
	@echo "$(GREEN)Docker services restarted!$(NC)"

.PHONY: docker-logs
docker-logs: ## Docker: View logs from all services
	docker-compose logs -f

.PHONY: docker-logs-backend
docker-logs-backend: ## Docker: View backend logs
	docker-compose logs -f backend

.PHONY: docker-shell-backend
docker-shell-backend: ## Docker: Open shell in backend container
	docker-compose exec backend sh

.PHONY: docker-shell-mongo
docker-shell-mongo: ## Docker: Open MongoDB shell
	docker-compose exec mongodb mongosh

.PHONY: docker-clean
docker-clean: ## Docker: Remove all containers, images, and volumes
	@echo "$(RED)Removing all Docker containers, images, and volumes...$(NC)"
	docker-compose down -v --remove-orphans
	docker system prune -f
	@echo "$(GREEN)Docker cleanup completed!$(NC)"

# =============================================================================
# DATABASE COMMANDS
# =============================================================================
.PHONY: db-setup
db-setup: ## Database: Initialize database with categories
	@echo "$(BLUE)Setting up database...$(NC)"
	cd $(BACKEND_DIR) && npm run setup
	@echo "$(GREEN)Database setup completed!$(NC)"

.PHONY: db-seed
db-seed: ## Database: Seed database with sample data
	@echo "$(BLUE)Seeding database...$(NC)"
	cd $(BACKEND_DIR) && npm run seed
	@echo "$(GREEN)Database seeded successfully!$(NC)"

.PHONY: db-reset
db-reset: ## Database: Reset and reinitialize database
	@echo "$(RED)Resetting database...$(NC)"
	@read -p "Are you sure you want to reset the database? [y/N]: " confirm && [ "$$confirm" = "y" ]
	cd $(BACKEND_DIR) && npm run setup
	@echo "$(GREEN)Database reset completed!$(NC)"

.PHONY: db-backup
db-backup: ## Database: Create database backup
	@echo "$(BLUE)Creating database backup...$(NC)"
	mkdir -p backups
	mongodump --db feeshay --out backups/$(shell date +%Y%m%d_%H%M%S)
	@echo "$(GREEN)Database backup created!$(NC)"

.PHONY: db-restore
db-restore: ## Database: Restore database from backup (specify BACKUP_DIR)
	@echo "$(BLUE)Restoring database from backup...$(NC)"
	@if [ -z "$(BACKUP_DIR)" ]; then \
		echo "$(RED)Please specify BACKUP_DIR. Example: make db-restore BACKUP_DIR=backups/20240101_120000$(NC)"; \
		exit 1; \
	fi
	mongorestore --db feeshay --drop $(BACKUP_DIR)/feeshay
	@echo "$(GREEN)Database restored successfully!$(NC)"

# =============================================================================
# BUILD COMMANDS
# =============================================================================
.PHONY: build-backend
build-backend: ## Build backend for production
	@echo "$(BLUE)Building backend...$(NC)"
	cd $(BACKEND_DIR) && npm run build
	@echo "$(GREEN)Backend built successfully!$(NC)"

.PHONY: build-frontend-ios
build-frontend-ios: ## Build frontend for iOS
	@echo "$(BLUE)Building frontend for iOS...$(NC)"
	cd $(FRONTEND_DIR) && eas build --platform ios
	@echo "$(GREEN)iOS build completed!$(NC)"

.PHONY: build-frontend-android
build-frontend-android: ## Build frontend for Android
	@echo "$(BLUE)Building frontend for Android...$(NC)"
	cd $(FRONTEND_DIR) && eas build --platform android
	@echo "$(GREEN)Android build completed!$(NC)"

.PHONY: build-frontend-web
build-frontend-web: ## Build frontend for web
	@echo "$(BLUE)Building frontend for web...$(NC)"
	cd $(FRONTEND_DIR) && npx expo export:web
	@echo "$(GREEN)Web build completed!$(NC)"

# =============================================================================
# PRODUCTION COMMANDS
# =============================================================================
.PHONY: prod-deploy
prod-deploy: ## Production: Deploy to production (requires setup)
	@echo "$(BLUE)Deploying to production...$(NC)"
	@echo "$(RED)Make sure you have configured your production environment!$(NC)"
	docker-compose -f $(COMPOSE_FILE) up -d --build
	@echo "$(GREEN)Production deployment completed!$(NC)"

.PHONY: prod-update
prod-update: ## Production: Update production deployment
	@echo "$(BLUE)Updating production deployment...$(NC)"
	git pull origin main
	docker-compose -f $(COMPOSE_FILE) up -d --build
	@echo "$(GREEN)Production update completed!$(NC)"

.PHONY: prod-logs
prod-logs: ## Production: View production logs
	docker-compose -f $(COMPOSE_FILE) logs -f

.PHONY: prod-backup
prod-backup: ## Production: Create production backup
	@echo "$(BLUE)Creating production backup...$(NC)"
	./scripts/backup-production.sh
	@echo "$(GREEN)Production backup completed!$(NC)"

# =============================================================================
# MAINTENANCE COMMANDS
# =============================================================================
.PHONY: update-deps
update-deps: ## Update all dependencies
	@echo "$(BLUE)Updating dependencies...$(NC)"
	cd $(BACKEND_DIR) && npm update
	cd $(FRONTEND_DIR) && npm update
	@echo "$(GREEN)Dependencies updated!$(NC)"

.PHONY: security-audit
security-audit: ## Run security audit on dependencies
	@echo "$(BLUE)Running security audit...$(NC)"
	cd $(BACKEND_DIR) && npm audit
	cd $(FRONTEND_DIR) && npm audit
	@echo "$(GREEN)Security audit completed!$(NC)"

.PHONY: setup-env
setup-env: ## Setup environment files from examples
	@echo "$(BLUE)Setting up environment files...$(NC)"
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
		echo "$(YELLOW)Created $(BACKEND_DIR)/.env from example$(NC)"; \
	fi
	@if [ ! -f $(FRONTEND_DIR)/.env ]; then \
		echo "EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1" > $(FRONTEND_DIR)/.env; \
		echo "$(YELLOW)Created $(FRONTEND_DIR)/.env$(NC)"; \
	fi
	@echo "$(GREEN)Environment files setup completed!$(NC)"
	@echo "$(RED)Please review and update the .env files with your actual values$(NC)"

.PHONY: setup-data-dirs
setup-data-dirs: ## Create necessary data directories
	@echo "$(BLUE)Creating data directories...$(NC)"
	mkdir -p $(DATA_DIR)/mongodb
	mkdir -p $(DATA_DIR)/mongodb-config
	mkdir -p $(DATA_DIR)/redis
	mkdir -p $(DATA_DIR)/uploads
	mkdir -p $(DATA_DIR)/logs
	mkdir -p backups
	@echo "$(GREEN)Data directories created!$(NC)"

.PHONY: health-check
health-check: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(NC)"
	@echo "Backend API:"
	@curl -f http://localhost:3000/health 2>/dev/null || echo "$(RED)Backend API is not responding$(NC)"
	@echo ""
	@echo "MongoDB:"
	@docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" 2>/dev/null || echo "$(RED)MongoDB is not responding$(NC)"
	@echo "$(GREEN)Health check completed!$(NC)"

# =============================================================================
# QUICK SETUP COMMANDS
# =============================================================================
.PHONY: quick-start
quick-start: setup-env setup-data-dirs install db-setup ## Quick setup for new developers
	@echo "$(GREEN)Quick start setup completed!$(NC)"
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "1. Review and update .env files in Backend/ and Frontend/"
	@echo "2. Start MongoDB: mongod"
	@echo "3. Run: make dev-start"

.PHONY: docker-quick-start
docker-quick-start: setup-env setup-data-dirs docker-build docker-up-dev ## Quick Docker setup
	@echo "$(GREEN)Docker quick start completed!$(NC)"
	@echo "$(YELLOW)Services running:$(NC)"
	@echo "- Backend: http://localhost:3000"
	@echo "- MongoDB Express: http://localhost:8081"

# =============================================================================
# STATUS AND INFO
# =============================================================================
.PHONY: status
status: ## Show project status and running services
	@echo "$(BLUE)FeeShay Project Status$(NC)"
	@echo "====================="
	@echo ""
	@echo "$(YELLOW)Docker Services:$(NC)"
	@docker-compose ps 2>/dev/null || echo "Docker Compose not running"
	@echo ""
	@echo "$(YELLOW)Project Structure:$(NC)"
	@echo "Backend: $(BACKEND_DIR)/"
	@echo "Frontend: $(FRONTEND_DIR)/"
	@echo "Data: $(DATA_DIR)/"
	@echo ""
	@echo "$(YELLOW)Useful URLs:$(NC)"
	@echo "Backend API: http://localhost:3000"
	@echo "Frontend Web: http://localhost:19006"
	@echo "MongoDB Express: http://localhost:8081"

.PHONY: version
version: ## Show version information
	@echo "$(BLUE)Version Information$(NC)"
	@echo "==================="
	@echo "Node.js: $(shell node --version 2>/dev/null || echo 'Not installed')"
	@echo "npm: $(shell npm --version 2>/dev/null || echo 'Not installed')"
	@echo "Docker: $(shell docker --version 2>/dev/null || echo 'Not installed')"
	@echo "Docker Compose: $(shell docker-compose --version 2>/dev/null || echo 'Not installed')"
	@echo "MongoDB: $(shell mongod --version 2>/dev/null | head -1 || echo 'Not installed')"
	@echo "Expo CLI: $(shell npx expo --version 2>/dev/null || echo 'Not installed')"

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================
.PHONY: check-deps
check-deps: ## Check if required dependencies are installed
	@echo "$(BLUE)Checking dependencies...$(NC)"
	@command -v node >/dev/null 2>&1 || { echo "$(RED)Node.js is not installed$(NC)"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "$(RED)npm is not installed$(NC)"; exit 1; }
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)Docker is not installed$(NC)"; exit 1; }
	@command -v docker-compose >/dev/null 2>&1 || { echo "$(RED)Docker Compose is not installed$(NC)"; exit 1; }
	@echo "$(GREEN)All required dependencies are installed!$(NC)"

# Default target
.DEFAULT_GOAL := help 