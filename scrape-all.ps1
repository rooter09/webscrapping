# Comprehensive World of Books Scraping Script
Write-Host "Starting comprehensive scraping of World of Books..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000"

# Step 1: Scrape Navigation
Write-Host "Step 1: Scraping navigation headings..." -ForegroundColor Yellow
try {
    $navResponse = Invoke-RestMethod -Uri "$baseUrl/navigation/scrape" -Method Post
    Write-Host "SUCCESS: Navigation scraped!" -ForegroundColor Green
    Write-Host "Found $($navResponse.Count) navigation items" -ForegroundColor Gray
} catch {
    Write-Host "ERROR scraping navigation: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 3

# Step 2: Get all navigation items
Write-Host ""
Write-Host "Step 2: Fetching navigation items..." -ForegroundColor Yellow
try {
    $navItems = Invoke-RestMethod -Uri "$baseUrl/navigation" -Method Get
    Write-Host "SUCCESS: Retrieved $($navItems.Count) navigation items" -ForegroundColor Green
    
    foreach ($nav in $navItems) {
        Write-Host "  - $($nav.title)" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR fetching navigation: $_" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 2

# Step 3: Scrape categories
Write-Host ""
Write-Host "Step 3: Scraping categories..." -ForegroundColor Yellow
$totalCategories = 0

foreach ($nav in $navItems) {
    if ($nav.url -and $nav.url -match "worldofbooks.com" -and $nav.url -notmatch "#") {
        Write-Host "  Scraping categories for: $($nav.title)..." -ForegroundColor Cyan
        
        try {
            $body = @{
                navigationUrl = $nav.url
                navigationId = $nav.id
            } | ConvertTo-Json
            
            $catResponse = Invoke-RestMethod -Uri "$baseUrl/categories/scrape" -Method Post -Body $body -ContentType "application/json"
            $totalCategories += $catResponse.Count
            Write-Host "  SUCCESS: Found $($catResponse.Count) categories" -ForegroundColor Green
            
            Start-Sleep -Seconds 3
        } catch {
            Write-Host "  SKIPPED: $($_.Exception.Message)" -ForegroundColor DarkYellow
        }
    }
}

Write-Host "Total categories scraped: $totalCategories" -ForegroundColor Green

# Step 4: Scrape products
Write-Host ""
Write-Host "Step 4: Scraping products from top 5 categories..." -ForegroundColor Yellow

try {
    $categories = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Get
    $categoriesToScrape = $categories | Where-Object { $_.url -match "worldofbooks.com" } | Select-Object -First 5
    
    $totalProducts = 0
    foreach ($category in $categoriesToScrape) {
        Write-Host "  Scraping products from: $($category.title)..." -ForegroundColor Cyan
        
        try {
            $body = @{
                categoryUrl = $category.url
                categoryId = $category.id
                maxPages = 2
            } | ConvertTo-Json
            
            $prodResponse = Invoke-RestMethod -Uri "$baseUrl/products/scrape" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 60
            $totalProducts += $prodResponse.Count
            Write-Host "  SUCCESS: Scraped $($prodResponse.Count) products" -ForegroundColor Green
            
            Start-Sleep -Seconds 5
        } catch {
            Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor DarkYellow
        }
    }
    
    Write-Host "Total products scraped: $totalProducts" -ForegroundColor Green
} catch {
    Write-Host "ERROR in product scraping: $_" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "SCRAPING SUMMARY" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

try {
    $allProducts = Invoke-RestMethod -Uri "$baseUrl/products?limit=1000" -Method Get
    $allCategories = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Get
    $allNavigation = Invoke-RestMethod -Uri "$baseUrl/navigation" -Method Get
    
    Write-Host "Navigation Items: $($allNavigation.Count)" -ForegroundColor White
    Write-Host "Categories: $($allCategories.Count)" -ForegroundColor White
    Write-Host "Products: $($allProducts.total)" -ForegroundColor White
    Write-Host "=======================================" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "Sample Products:" -ForegroundColor Yellow
    $allProducts.data | Select-Object -First 10 | ForEach-Object {
        Write-Host "  - $($_.title) by $($_.author) - GBP $($_.price)" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR fetching summary: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Scraping completed!" -ForegroundColor Green
Write-Host "View products at: http://localhost:3000/products" -ForegroundColor Cyan
