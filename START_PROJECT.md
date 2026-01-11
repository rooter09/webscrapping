# 🚀 Quick Start Guide - Product Data Explorer

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ PostgreSQL 14+ installed and running
- ✅ npm installed (`npm --version`)

---

## 🎯 Recommended: Quick Start (5 minutes)

### Option A: Using Docker (Easiest - No PostgreSQL setup needed)

```bash
# 1. Navigate to project
cd e:\assignment

# 2. Copy environment file
copy .env.docker.example .env

# 3. Start everything
docker-compose up -d

# 4. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:4000/api
```

**Done!** All services are running.

To stop: `docker-compose down`

---

### Option B: Manual Setup (If you don't have Docker)

#### Step 1: Setup Database (One-time)

```bash
# Create PostgreSQL database
createdb product_explorer

# Or using psql:
psql -U postgres
CREATE DATABASE product_explorer;
\q
```

#### Step 2: Configure Backend

```bash
# Navigate to backend
cd e:\assignment\backend

# Make sure .env exists (it should already be there)
# If not, copy from example:
copy .env.example .env

# Edit .env and update these if needed:
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USER=postgres
# DATABASE_PASSWORD=your_password_here
# DATABASE_NAME=product_explorer
```

#### Step 3: Start Backend

```bash
# Still in e:\assignment\backend

# Install dependencies (first time only)
npm install

# Seed database (first time only)
npm run seed

# Start backend
npm run start:dev
```

✅ Backend running at: **http://localhost:4000**
✅ API Docs at: **http://localhost:4000/api**

#### Step 4: Start Frontend (New Terminal)

```bash
# Navigate to frontend
cd e:\assignment\frontend

# Install dependencies (first time only)
npm install

# Start frontend
npm run dev
```

✅ Frontend running at: **http://localhost:3000**

---

## 🎉 Access the Application

Once running, open your browser:

1. **Homepage**: http://localhost:3000
2. **Products**: http://localhost:3000/products
3. **About**: http://localhost:3000/about
4. **Contact**: http://localhost:3000/contact
5. **API Documentation**: http://localhost:4000/api

---

## 🧪 Run Tests

```bash
# Backend tests
cd e:\assignment\backend
npm run test

# Frontend linting
cd e:\assignment\frontend
npm run lint
```

---

## 🛑 Stop the Project

### If using Docker:
```bash
docker-compose down
```

### If running manually:
- Press `Ctrl+C` in both terminal windows (backend and frontend)

---

## 🔧 Troubleshooting

### Backend won't start?
- ✅ Check PostgreSQL is running
- ✅ Verify database credentials in `.env`
- ✅ Make sure port 4000 is not in use

### Frontend won't start?
- ✅ Check backend is running first
- ✅ Verify `NEXT_PUBLIC_API_URL=http://localhost:4000` in `.env.local`
- ✅ Make sure port 3000 is not in use

### Database connection error?
- ✅ Ensure PostgreSQL service is running
- ✅ Check username/password in `.env`
- ✅ Verify database `product_explorer` exists

### Port already in use?
```bash
# Windows - Find and kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F

# Or change port in .env:
# PORT=4001
```

---

## 📚 Additional Commands

### Backend
```bash
cd e:\assignment\backend

npm run start:dev    # Development mode with hot reload
npm run build        # Build for production
npm run start:prod   # Run production build
npm run test         # Run tests
npm run test:cov     # Test coverage
npm run lint         # Lint code
```

### Frontend
```bash
cd e:\assignment\frontend

npm run dev          # Development mode
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Lint code
```

---

## 🎯 What to Expect

### First Run:
1. Backend will connect to PostgreSQL
2. Database tables will be created automatically
3. You can manually trigger scraping from the UI
4. Or use the seed script to populate initial data

### Features to Try:
- ✅ Browse navigation categories
- ✅ View products with filters
- ✅ Search products
- ✅ View product details
- ✅ See reviews and ratings
- ✅ Trigger on-demand scraping

---

## 📖 More Information

- **Full Documentation**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **API Documentation**: http://localhost:4000/api (when running)

---

**Need help?** Check the troubleshooting section or refer to the main README.md
