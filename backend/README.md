# Product Data Explorer - Backend

NestJS backend API for the Product Data Explorer application.

## Features

- RESTful API with Swagger documentation
- PostgreSQL database with TypeORM
- Web scraping with Crawlee + Playwright
- Intelligent caching with TTL
- Rate limiting and ethical scraping practices
- Comprehensive error handling and logging

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the database credentials and other settings as needed.

## Database Setup

Make sure PostgreSQL is running, then create the database:

```sql
CREATE DATABASE product_explorer;
```

Run the seed script to initialize the schema:

```bash
npm run seed
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

The API will be available at `http://localhost:4000`

API Documentation (Swagger): `http://localhost:4000/api`

### Production Mode

```bash
npm run build
npm run start:prod
```

## API Endpoints

### Navigation
- `GET /navigation` - Get all navigation headings
- `GET /navigation/:id` - Get navigation by ID
- `GET /navigation/slug/:slug` - Get navigation by slug
- `POST /navigation/scrape` - Trigger navigation scrape

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `GET /categories/slug/:slug` - Get category by slug
- `GET /categories/parent/:parentId` - Get subcategories
- `POST /categories/scrape` - Trigger category scrape

### Products
- `GET /products` - Get products with filters and pagination
- `GET /products/:id` - Get product details
- `GET /products/source/:sourceId` - Get product by source ID
- `POST /products/scrape` - Scrape products from a category
- `POST /products/:id/refresh` - Refresh product details
- `POST /products/:id/scrape-detail` - Scrape detailed product info

### View History
- `POST /view-history` - Record a page view
- `GET /view-history/session/:sessionId` - Get session history
- `GET /view-history/user/:userId` - Get user history

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run seed` - Seed the database
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── entities/          # TypeORM entities
├── modules/           # Feature modules
│   ├── navigation/
│   ├── category/
│   ├── product/
│   └── view-history/
├── scraper/           # Web scraping service
├── common/            # Shared DTOs and utilities
├── app.module.ts      # Main application module
└── main.ts            # Application entry point
```

## Environment Variables

See `.env.example` for all available configuration options.

## License

MIT
