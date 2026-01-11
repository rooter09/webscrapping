# 🚀 Deployment Guide

This guide covers deploying the Product Data Explorer to production environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Backend Deployment (Render/Railway)](#backend-deployment)
- [Frontend Deployment (Vercel)](#frontend-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

---

## Prerequisites

- GitHub account
- PostgreSQL database (managed service recommended)
- Vercel account (for frontend)
- Render/Railway/Fly.io account (for backend)

---

## Backend Deployment

### Option 1: Render

1. **Create PostgreSQL Database**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "PostgreSQL"
   - Name: `product-explorer-db`
   - Plan: Free or Starter
   - Note the connection details

2. **Deploy Backend Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `product-explorer-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start:prod`
     - **Plan**: Free or Starter

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=4000
   DATABASE_HOST=<your-postgres-host>
   DATABASE_PORT=5432
   DATABASE_USER=<your-postgres-user>
   DATABASE_PASSWORD=<your-postgres-password>
   DATABASE_NAME=<your-postgres-db-name>
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   CACHE_TTL_HOURS=24
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://product-explorer-backend.onrender.com`)

### Option 2: Railway

1. **Create New Project**
   - Go to [Railway](https://railway.app/)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically provision and connect it

3. **Configure Backend Service**
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

4. **Set Environment Variables** (same as Render above)

5. **Deploy** and note your backend URL

---

## Frontend Deployment

### Vercel (Recommended)

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be live at `https://your-project.vercel.app`

5. **Update Backend CORS**
   - Go back to your backend service (Render/Railway)
   - Update `CORS_ORIGIN` environment variable with your Vercel URL
   - Redeploy backend if needed

---

## Docker Deployment

### Using Docker Compose (Self-Hosted)

1. **Clone Repository**
   ```bash
   git clone https://github.com/rooter09/webscrapping.git
   cd webscrapping
   ```

2. **Create Environment File**
   ```bash
   cp .env.docker.example .env
   # Edit .env with your configuration
   ```

3. **Build and Run**
   ```bash
   docker-compose up -d
   ```

4. **Access Application**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:4000`
   - API Docs: `http://localhost:4000/api`

5. **View Logs**
   ```bash
   docker-compose logs -f
   ```

6. **Stop Services**
   ```bash
   docker-compose down
   ```

### Individual Docker Builds

**Backend:**
```bash
cd backend
docker build -t product-explorer-backend .
docker run -p 4000:4000 \
  -e DATABASE_HOST=your-db-host \
  -e DATABASE_PASSWORD=your-password \
  product-explorer-backend
```

**Frontend:**
```bash
cd frontend
docker build -t product-explorer-frontend \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:4000 .
docker run -p 3000:3000 product-explorer-frontend
```

---

## Environment Variables

### Backend (.env)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `production` | Yes |
| `PORT` | Server port | `4000` | Yes |
| `DATABASE_HOST` | PostgreSQL host | `localhost` | Yes |
| `DATABASE_PORT` | PostgreSQL port | `5432` | Yes |
| `DATABASE_USER` | Database user | `postgres` | Yes |
| `DATABASE_PASSWORD` | Database password | `your_password` | Yes |
| `DATABASE_NAME` | Database name | `product_explorer` | Yes |
| `CORS_ORIGIN` | Allowed frontend origin | `https://app.vercel.app` | Yes |
| `CACHE_TTL_HOURS` | Cache duration | `24` | No (default: 24) |

### Frontend (.env.local)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000` | Yes |

---

## Post-Deployment

### 1. Initialize Database

The database will auto-sync on first run, but you can manually seed data:

```bash
# SSH into your backend server or use Railway/Render shell
npm run seed
```

### 2. Verify Deployment

- ✅ Frontend loads at your Vercel URL
- ✅ Backend health check: `https://your-backend-url/health`
- ✅ API docs accessible: `https://your-backend-url/api`
- ✅ Navigation data loads on homepage
- ✅ Products page displays items
- ✅ Product detail pages work

### 3. Test Scraping

1. Visit your frontend
2. Navigate to home page
3. Click on a category
4. Verify products load
5. Click on a product
6. Verify details, reviews, and recommendations load

### 4. Monitor Performance

**Render/Railway:**
- Check logs for errors
- Monitor memory and CPU usage
- Set up alerts for downtime

**Vercel:**
- Check Analytics dashboard
- Monitor build times
- Review function logs

### 5. Set Up Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

**Render/Railway:**
1. Go to Settings → Custom Domains
2. Add your domain
3. Update DNS records

---

## Troubleshooting

### Backend Issues

**Database Connection Failed:**
- Verify DATABASE_* environment variables
- Check if database is running
- Ensure IP whitelist includes your backend server

**CORS Errors:**
- Update `CORS_ORIGIN` with exact frontend URL
- Include protocol (https://)
- No trailing slash

**Scraping Fails:**
- Check Playwright dependencies are installed
- Verify World of Books is accessible
- Review rate limiting settings

### Frontend Issues

**API Calls Fail:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running
- Verify CORS is configured

**Build Fails:**
- Check Node version (18+)
- Clear `.next` folder and rebuild
- Verify all dependencies are installed

---

## Scaling Considerations

### Database
- Upgrade to paid plan for better performance
- Enable connection pooling
- Add read replicas for high traffic

### Backend
- Scale horizontally with multiple instances
- Add Redis for caching
- Implement job queue for scraping

### Frontend
- Vercel auto-scales
- Enable ISR (Incremental Static Regeneration)
- Optimize images and assets

---

## Security Checklist

- ✅ All secrets in environment variables
- ✅ CORS properly configured
- ✅ Database credentials secured
- ✅ HTTPS enabled
- ✅ Rate limiting active
- ✅ Input validation enabled
- ✅ No secrets in git history

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/rooter09/webscrapping/issues
- Email: support@productexplorer.com

---

**Last Updated**: January 2026
