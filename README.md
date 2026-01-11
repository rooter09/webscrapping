# Product Data Explorer - Full-Stack Web Scraping Application

A production-ready product exploration platform that enables users to navigate from high-level headings → categories → products → product detail pages, powered by live, on-demand scraping from **World of Books**.

## 🚀 Live Demo

- **Frontend**: [Deployment URL - To be added after deployment]
- **Backend API**: [Deployment URL - To be added after deployment]
- **API Documentation**: [Swagger URL - To be added after deployment]

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Testing](#testing)
- [Ethical Scraping](#ethical-scraping)

## ✨ Features

### Core Features
- ✅ **Live Web Scraping**: Real-time data extraction from World of Books using Crawlee + Playwright
- ✅ **Hierarchical Navigation**: Browse from navigation headings → categories → products → details
- ✅ **Advanced Filtering**: Search and filter products by price, rating, author, and more
- ✅ **Intelligent Caching**: TTL-based caching (24 hours default) to minimize server load
- ✅ **On-Demand Refresh**: Manually trigger data updates for specific products
- ✅ **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ✅ **Browsing History**: Client-side and server-side history tracking
- ✅ **Product Reviews**: Display user reviews and ratings
- ✅ **Related Products**: Show product recommendations

### Bonus Features
- ✅ **Product Search**: Full-text search across titles and authors
- ✅ **Rich Filters**: Price range, minimum rating, author filters
- ✅ **Pagination**: Efficient pagination for large product lists
- ✅ **Loading States**: Skeleton screens for better UX
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **API Documentation**: Interactive Swagger/OpenAPI documentation
- ✅ **Accessibility**: WCAG AA compliant with keyboard navigation

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **HTTP Client**: Axios
- **Deployment**: Vercel

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM
- **Scraping**: Crawlee + Playwright
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Render/Railway/Fly.io

### DevOps
- **CI/CD**: GitHub Actions
- **Version Control**: Git
- **Package Manager**: npm

## 📁 Project Structure

```
product-data-explorer/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── page.tsx        # Home page
│   │   ├── products/       # Products pages
│   │   ├── categories/     # Categories pages
│   │   └── about/          # About page
│   ├── components/          # Reusable React components
│   ├── lib/                # Utilities and API client
│   └── types/              # TypeScript type definitions
│
├── backend/                 # NestJS backend API
│   ├── src/
│   │   ├── entities/       # TypeORM database entities
│   │   ├── modules/        # Feature modules
│   │   │   ├── navigation/
│   │   │   ├── category/
│   │   │   ├── product/
│   │   │   └── view-history/
│   │   ├── scraper/        # Web scraping service
│   │   ├── common/         # Shared DTOs and utilities
│   │   ├── app.module.ts   # Main application module
│   │   └── main.ts         # Application entry point
│   └── test/               # Test files
│
└── README.md               # This file
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/rooter09/webscrapping.git
cd webscrapping
```

2. **Set up the backend**

```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your database credentials

# Create PostgreSQL database
createdb product_explorer

# Run database migrations
npm run seed

# Start the backend
npm run start:dev
```

The backend will be available at `http://localhost:4000`
API Documentation: `http://localhost:4000/api`

3. **Set up the frontend**

```bash
cd frontend
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local

# Start the frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

The API follows RESTful conventions. Full interactive documentation is available via Swagger at `/api` when the backend is running.

### Key Endpoints

#### Navigation
- `GET /navigation` - Get all navigation headings
- `GET /navigation/:id` - Get navigation by ID
- `POST /navigation/scrape` - Trigger navigation scrape

#### Categories
- `GET /categories` - Get all categories (with optional filters)
- `GET /categories/:id` - Get category details
- `POST /categories/scrape` - Trigger category scrape

#### Products
- `GET /products` - List products (with pagination & filters)
  - Query params: `page`, `limit`, `search`, `minPrice`, `maxPrice`, `minRating`, `author`, `sortBy`, `sortOrder`
- `GET /products/:id` - Get product details
- `POST /products/scrape` - Scrape products from a category
- `POST /products/:id/refresh` - Refresh product data

#### View History
- `POST /view-history` - Record a page view
- `GET /view-history/session/:sessionId` - Get session history

## 🗄️ Database Schema

### Entities

**Navigation**
- Stores top-level navigation headings from World of Books
- Fields: id, title, slug, url, lastScrapedAt

**Category**
- Hierarchical category structure with parent-child relationships
- Fields: id, navigationId, parentId, title, slug, url, productCount, lastScrapedAt

**Product**
- Core product information
- Fields: id, sourceId, categoryId, title, author, price, currency, imageUrl, sourceUrl, lastScrapedAt

**ProductDetail**
- Extended product information
- Fields: id, productId, description, specs, ratingsAvg, reviewsCount, isbn, publisher, publicationDate

**Review**
- User reviews and ratings
- Fields: id, productId, author, rating, text, title, verified, reviewDate

**ScrapeJob**
- Tracks scraping jobs and their status
- Fields: id, targetUrl, targetType, status, startedAt, finishedAt, errorLog

**ViewHistory**
- Stores user browsing history
- Fields: id, userId, sessionId, pathJson, url, productId, categoryId

## 🚀 Deployment

### Quick Start with Docker (Recommended)

The easiest way to run the entire stack locally:

```bash
# Clone the repository
git clone https://github.com/rooter09/webscrapping.git
cd webscrapping

# Copy environment file
cp .env.docker.example .env
# Edit .env with your configuration

# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api

### Backend Deployment (Render/Railway)

1. Create a PostgreSQL database
2. Create a new web service
3. Set environment variables:
   ```
   DATABASE_HOST=<your-db-host>
   DATABASE_PORT=5432
   DATABASE_USER=<your-db-user>
   DATABASE_PASSWORD=<your-db-password>
   DATABASE_NAME=product_explorer
   PORT=4000
   NODE_ENV=production
   CORS_ORIGIN=<your-frontend-url>
   ```
4. Deploy from GitHub repository

### Frontend Deployment (Vercel)

1. Import GitHub repository to Vercel
2. Set framework preset to Next.js
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=<your-backend-url>
   ```
4. Deploy

**📖 For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # Coverage report
```

### Frontend Tests

```bash
cd frontend
npm run test           # Jest tests
npm run lint           # ESLint
```

## 🔒 Ethical Scraping

This project implements responsible web scraping practices:

- ✅ Respects robots.txt and terms of service
- ✅ Implements rate limiting (2-3 seconds between requests)
- ✅ Uses exponential backoff on errors
- ✅ Aggressive caching to minimize requests (24-hour TTL)
- ✅ Proper error handling and logging
- ✅ User-agent identification
- ✅ Monitoring of scraping impact

**Note**: This project is for educational purposes. Always ensure you have permission to scrape websites and comply with their terms of service.

## 📊 Performance

- Database indexing on frequently queried fields
- Pagination for all list endpoints
- Image optimization with Next.js Image component
- Lazy loading for product grids
- Efficient caching strategy
- Connection pooling for database

## ♿ Accessibility

- Semantic HTML5 elements
- Keyboard navigation support
- Alt text for all images
- ARIA labels where appropriate
- WCAG AA color contrast compliance
- Focus visible states

## 🤝 Contributing

This is an assignment project. For questions or issues, please contact the repository owner.

## 📄 License

This project is created as part of a technical assignment.

## 👤 Author

- GitHub: [@rooter09](https://github.com/rooter09)

## 🙏 Acknowledgments

- World of Books for the data source
- NestJS and Next.js communities
- Crawlee team for the excellent scraping framework

---

**Built with ❤️ using Next.js, NestJS, and TypeScript**
