import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ScrapedNavigation {
    title: string;
    url: string;
    slug: string;
}

export interface ScrapedCategory {
    title: string;
    url: string;
    slug: string;
    productCount?: number;
}

export interface ScrapedProduct {
    sourceId: string;
    title: string;
    author?: string;
    price?: number;
    currency: string;
    imageUrl?: string;
    sourceUrl: string;
}

export interface ScrapedProductDetail {
    description?: string;
    specs?: Record<string, any>;
    isbn?: string;
    publisher?: string;
    publicationDate?: string;
    relatedProducts?: string[];
}

export interface ScrapedReview {
    author?: string;
    rating: number;
    text?: string;
    title?: string;
    verified?: boolean;
    reviewDate?: string;
}

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);
    private readonly baseUrl = 'https://www.worldofbooks.com';
    private readonly delayMs: number;
    private readonly maxRetries: number;
    private readonly userAgent: string;

    constructor(private configService: ConfigService) {
        this.delayMs = this.configService.get<number>('SCRAPE_DELAY_MS', 2000);
        this.maxRetries = this.configService.get<number>('SCRAPE_MAX_RETRIES', 3);
        this.userAgent = this.configService.get<string>(
            'USER_AGENT',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        );
    }

    /**
     * Scrape navigation headings from the homepage
     */
    async scrapeNavigation(): Promise<ScrapedNavigation[]> {
        this.logger.log('Starting navigation scrape...');
        const results: ScrapedNavigation[] = [];

        try {
            const { chromium } = require('playwright');
            const browser = await chromium.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto(this.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await this.delay(2000); // Increased delay to allow hydration

            // Try to find navigation elements
            const navItems = await page.$$eval(
                'nav a, header a, .navigation a, .nav-item a, [role="navigation"] a',
                (elements: any[]) =>
                    elements
                        .map((el) => ({
                            title: el.textContent?.trim() || '',
                            url: (el as HTMLAnchorElement).href || '',
                        }))
                        .filter((item) => item.title && item.url),
            );

            // Filter and deduplicate
            const seen = new Set<string>();
            navItems.forEach((item: { title: string; url: string }) => {
                const slug = this.createSlug(item.title);
                if (!seen.has(slug) && item.title.length > 2) {
                    seen.add(slug);
                    results.push({
                        title: item.title,
                        url: item.url,
                        slug,
                    });
                }
            });

            await browser.close();
            this.logger.log(`Scraped ${results.length} navigation items`);
            return results;
        } catch (error) {
            this.logger.error('Navigation scrape failed', error);
            throw error;
        }
    }

    /**
     * Scrape categories from a navigation URL
     */
    async scrapeCategories(url: string): Promise<ScrapedCategory[]> {
        this.logger.log(`Scraping categories from: ${url}`);
        const results: ScrapedCategory[] = [];

        try {
            const { chromium } = require('playwright');
            const browser = await chromium.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await this.delay(2000);

            // Look for category links (Sidebar navigation)
            const categories = await page.$$eval(
                '.list-menu__item a, .facets__item a, .collection-list a',
                (elements: any[]) =>
                    elements
                        .map((el) => {
                            const title = el.textContent?.trim() || '';
                            const url = (el as HTMLAnchorElement).href || '';
                            // WOB specific: Filter out non-category links
                            if (!url.includes('/collections/') && !url.includes('/category/')) return null;

                            const countMatch = title.match(/\((\d+)\)/);
                            const productCount = countMatch
                                ? parseInt(countMatch[1], 10)
                                : undefined;

                            return {
                                title: title.replace(/\(\d+\)/, '').trim(),
                                url,
                                productCount,
                            };
                        })
                        .filter((item) => item && item.title && item.url),
            );

            const seen = new Set<string>();
            categories.forEach((item: any) => {
                if (!item) return;
                const slug = this.createSlug(item.title);
                if (!seen.has(slug)) {
                    seen.add(slug);
                    results.push({
                        ...item,
                        slug,
                    });
                }
            });

            // If empty, try fallback selectors
            if (results.length === 0) {
                // Fallback implementation if specific sidebars aren't found
            }

            await browser.close();
            this.logger.log(`Scraped ${results.length} categories`);
            return results;
        } catch (error) {
            this.logger.error('Category scrape failed', error);
            throw error;
        }
    }

    /**
     * Scrape products from a category page
     */
    async scrapeProducts(
        url: string,
        maxPages: number = 5,
    ): Promise<ScrapedProduct[]> {
        this.logger.log(`Scraping products from: ${url}`);
        const results: ScrapedProduct[] = [];

        try {
            const { chromium } = require('playwright');
            const browser = await chromium.launch({ headless: true });
            const page = await browser.newPage();

            let currentPageUrl = url;
            let pagesScraped = 0;

            while (currentPageUrl && pagesScraped < maxPages) {
                this.logger.log(`Scraping page ${pagesScraped + 1}: ${currentPageUrl}`);
                await page.goto(currentPageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                await this.delay(this.delayMs);

                // Extract products from the page
                const products = await page.$$eval(
                    '.main-product-card, .card-wrapper, .product-card',
                    (elements: any[]) =>
                        elements.map((el) => {
                            const titleEl = el.querySelector(
                                '.card__heading, h3.title, .product-title',
                            );
                            const authorEl = el.querySelector(
                                '.caption-with-letter-spacing, .author, .product-author',
                            ); // WOB/Shopify often puts author here
                            const priceEl = el.querySelector(
                                '.price-item--sale, .price-item--regular, .price',
                            );
                            const imageEl = el.querySelector('.card__media img, .media img, img');
                            const linkEl = el.querySelector('a.full-unstyled-link, .card__heading a, a');

                            const title = titleEl?.textContent?.trim() || '';
                            const author = authorEl?.textContent?.trim();
                            const priceText = priceEl?.textContent?.trim() || '';
                            const priceMatch = priceText.match(/[\d.]+/);
                            const price = priceMatch ? parseFloat(priceMatch[0]) : undefined;
                            const imageUrl = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src');
                            let productUrl = linkEl?.getAttribute('href') || '';

                            // Fix relative image URLs
                            let finalImageUrl = imageUrl;
                            if (imageUrl && imageUrl.startsWith('//')) {
                                finalImageUrl = 'https:' + imageUrl;
                            }

                            return {
                                title,
                                author,
                                price,
                                imageUrl: finalImageUrl,
                                productUrl,
                            };
                        }),
                );

                products.forEach((product: any) => {
                    if (product.title && product.productUrl) {
                        const fullUrl = product.productUrl.startsWith('http')
                            ? product.productUrl
                            : new URL(product.productUrl, currentPageUrl).href;

                        const sourceId = this.extractProductId(fullUrl);

                        results.push({
                            sourceId,
                            title: product.title,
                            author: product.author,
                            price: product.price,
                            currency: 'GBP',
                            imageUrl: product.imageUrl || undefined,
                            sourceUrl: fullUrl,
                        });
                    }
                });

                // Try to find next page link
                const nextPageUrl = await page.$eval(
                    '.pagination__item--next, a[rel="next"], .next',
                    (el: any) => (el as HTMLAnchorElement).href,
                ).catch(() => null);

                if (results.length >= maxPages * 20) break;

                currentPageUrl = nextPageUrl;
                pagesScraped++;
            }

            await browser.close();
            this.logger.log(`Scraped ${results.length} products`);
            return results;
        } catch (error) {
            this.logger.error('Product scrape failed', error);
            throw error;
        }
    }

    /**
     * Scrape detailed product information
     */
    async scrapeProductDetail(url: string): Promise<{
        detail: ScrapedProductDetail;
        reviews: ScrapedReview[];
    }> {
        this.logger.log(`Scraping product detail from: ${url}`);
        let detail: ScrapedProductDetail = {};
        const reviews: ScrapedReview[] = [];

        try {
            const { chromium } = require('playwright');
            const browser = await chromium.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await this.delay(2000);

            // Extract description
            const description = await page
                .$eval(
                    '.description, .product-description, [data-description]',
                    (el: any) => el.textContent?.trim(),
                )
                .catch(() => undefined);

            // Extract ISBN
            const isbn = await page
                .$eval(
                    '[data-isbn], .isbn',
                    (el: any) => el.textContent?.trim(),
                )
                .catch(() => undefined);

            // Extract publisher
            const publisher = await page
                .$eval(
                    '.publisher, [data-publisher]',
                    (el: any) => el.textContent?.trim(),
                )
                .catch(() => undefined);

            // Extract publication date
            const publicationDate = await page
                .$eval(
                    '.publication-date, [data-publication-date]',
                    (el: any) => el.textContent?.trim(),
                )
                .catch(() => undefined);

            // Extract related products
            const relatedProducts = await page
                .$$eval('.related-product a, .recommended a', (elements: any[]) =>
                    elements.map((el) => (el as HTMLAnchorElement).href),
                )
                .catch(() => []);

            // Extract specs
            const specs = await page
                .$$eval('.specs tr, .product-specs tr', (rows: any[]) => {
                    const specsObj: Record<string, any> = {};
                    rows.forEach((row) => {
                        const cells = row.querySelectorAll('td, th');
                        if (cells.length >= 2) {
                            const key = cells[0].textContent?.trim() || '';
                            const value = cells[1].textContent?.trim() || '';
                            if (key) specsObj[key] = value;
                        }
                    });
                    return specsObj;
                })
                .catch(() => ({}));

            detail = {
                description,
                specs: Object.keys(specs).length > 0 ? specs : undefined,
                isbn,
                publisher,
                publicationDate,
                relatedProducts:
                    relatedProducts.length > 0 ? relatedProducts : undefined,
            };

            // Extract reviews
            const reviewElements = await page
                .$$eval('.review, .product-review, [data-review]', (elements: any[]) =>
                    elements.map((el) => {
                        const authorEl = el.querySelector('.author, .reviewer');
                        const ratingEl = el.querySelector('[data-rating], .rating');
                        const textEl = el.querySelector('.review-text, .comment');
                        const titleEl = el.querySelector('.review-title');
                        const dateEl = el.querySelector('.review-date, .date');

                        const ratingText = ratingEl?.textContent?.trim() || '';
                        const ratingMatch = ratingText.match(/(\d+)/);
                        const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;

                        return {
                            author: authorEl?.textContent?.trim(),
                            rating,
                            ratingText, // Keeping context
                            text: textEl?.textContent?.trim(),
                            title: titleEl?.textContent?.trim(),
                            reviewDate: dateEl?.textContent?.trim(),
                        };
                    }),
                )
                .catch(() => []);

            reviews.push(...reviewElements.filter((r: any) => r.rating > 0));

            await browser.close();
            this.logger.log(
                `Scraped product detail with ${reviews.length} reviews`,
            );
            return { detail, reviews };
        } catch (error) {
            this.logger.error('Product detail scrape failed', error);
            throw error;
        }
    }

    /**
     * Create a URL-friendly slug from text
     */
    private createSlug(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Extract product ID from URL
     */
    private extractProductId(url: string): string {
        const match = url.match(/\/([a-z0-9-]+)(?:\?|$)/i);
        return match ? match[1] : url.split('/').pop() || url;
    }

    /**
     * Delay helper for rate limiting
     */
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
