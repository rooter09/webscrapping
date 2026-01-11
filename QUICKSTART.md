# Product Data Explorer - Quick Start Guide

## 🎯 What Has Been Built

A complete full-stack application with:

### ✅ Backend (NestJS)
- **7 Database Entities**: Navigation, Category, Product, ProductDetail, Review, ScrapeJob, ViewHistory
- **4 Feature Modules**: Navigation, Category, Product, View History
- **Web Scraping Service**: Crawlee + Playwright with rate limiting and caching
- **RESTful API**: Complete CRUD operations with filtering, pagination, and search
- **Swagger Documentation**: Interactive API docs at `/api`
- **Intelligent Caching**: 24-hour TTL to minimize scraping load
- **Error Handling**: Comprehensive error handling and logging

### ✅ Frontend (Next.js)
- **Home Page**: Hero section with navigation categories
- **Products Page**: Advanced filtering, search, sorting, and pagination
- **Product Detail Page**: Full product info, reviews, ratings, and refresh functionality
- **About Page**: Project documentation and features
- **Reusable Components**: Header, Footer, ProductCard, Skeletons
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Loading States**: Skeleton screens for better UX

### ✅ Additional Features
- TypeScript throughout for type safety
- Environment configuration for both apps
- Comprehensive README documentation
- Git repository initialized and pushed to GitHub

## 🚀 Next Steps

### 1. Set Up PostgreSQL Database

You need to create a PostgreSQL database before running the backend:

```bash
# Using PostgreSQL command line
createdb product_explorer

# Or using psql
psql -U postgres
CREATE DATABASE product_explorer;
\q
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password_here
DATABASE_NAME=product_explorer
PORT=4000
NODE_ENV=development
SCRAPE_DELAY_MS=2000
CACHE_TTL_HOURS=24
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (create `frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Install Dependencies & Run

**Backend**:
```bash
cd backend
npm install
npm run seed    # Initialize database schema
npm run start:dev
```

Backend will run on: http://localhost:4000
API Docs: http://localhost:4000/api

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:3000

### 4. Test the Application

1. **Visit** http://localhost:3000
2. **Click** on a category to browse
3. **Navigate** to products page
4. **Use filters** to search and filter products
5. **Click** on a product to see details

**Note**: Initially, there won't be any data. The application will scrape data on-demand when you:
- Visit the home page (scrapes navigation)
- Click on categories (scrapes category data)
- Browse products (scrapes product listings)

## 📦 Deployment Guide

### Deploy Backend (Render/Railway)

1. **Create PostgreSQL Database**
   - On Render: Create a new PostgreSQL database
   - Copy the Internal Database URL

2. **Create Web Service**
   - Connect your GitHub repository
   - Select `backend` as root directory
   - Build command: `npm install && npm run build`
   - Start command: `npm run start:prod`

3. **Set Environment Variables**:
   ```
   DATABASE_URL=<your-postgres-url>
   PORT=4000
   NODE_ENV=production
   CORS_ORIGIN=<your-frontend-url>
   SCRAPE_DELAY_MS=2000
   CACHE_TTL_HOURS=24
   ```

4. **Deploy** and note the backend URL

### Deploy Frontend (Vercel)

1. **Import Repository** to Vercel
2. **Configure**:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=<your-backend-url>
   ```

4. **Deploy**

### Update README

After deployment, update the main README.md with your live URLs:
```markdown
## 🚀 Live Demo

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-api.onrender.com
- **API Documentation**: https://your-api.onrender.com/api
```

## 🧪 Testing the Application

### Manual Testing Checklist

- [ ] Home page loads with navigation categories
- [ ] Clicking a category shows products
- [ ] Product filtering works (price, search, etc.)
- [ ] Pagination works correctly
- [ ] Product detail page shows all information
- [ ] Reviews are displayed correctly
- [ ] Refresh button updates product data
- [ ] Mobile responsive design works
- [ ] Loading states appear correctly
- [ ] Error handling works (try invalid URLs)

### API Testing

Use the Swagger documentation at `http://localhost:4000/api` to test:
- [ ] GET /navigation
- [ ] POST /navigation/scrape
- [ ] GET /products with filters
- [ ] GET /products/:id
- [ ] POST /products/:id/refresh

## 🎓 Assignment Submission

Submit through the Google Form: https://forms.gle/AiZRVZL2tyoQSups5

**Required Information**:
1. **GitHub Repository**: https://github.com/rooter09/webscrapping
2. **Live Frontend URL**: [After deployment]
3. **Live Backend URL**: [After deployment]

## 📝 Important Notes

### Scraping Behavior
- First load will be slow as data is being scraped
- Subsequent loads use cached data (24-hour TTL)
- Use "Refresh" buttons to force re-scrape
- Respect rate limits (2-second delay between requests)

### Database
- PostgreSQL 14+ required
- Run `npm run seed` to initialize schema
- Database will be empty initially
- Data populates as you browse

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- Update CORS_ORIGIN in production

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database exists: `createdb product_explorer`
- Check port 4000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend

### Scraping fails
- Check internet connection
- Verify World of Books is accessible
- Check Playwright is installed: `npx playwright install chromium`
- Review backend logs for errors

### Database errors
- Run migrations: `npm run seed`
- Check database connection string
- Verify PostgreSQL version (14+)

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Crawlee Documentation](https://crawlee.dev/)
- [TypeORM Documentation](https://typeorm.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🎉 Success Criteria

Your application is ready when:
- ✅ Backend runs without errors
- ✅ Frontend displays correctly
- ✅ Navigation categories load
- ✅ Products can be browsed and filtered
- ✅ Product details show with reviews
- ✅ Data persists in database
- ✅ API documentation is accessible
- ✅ Application is deployed and live

---

**Good luck with your assignment! 🚀**
