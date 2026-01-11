import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { Page } from 'playwright';

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

        const crawler = new PlaywrightCrawler({
            maxRequestsPerCrawl: 1,
            requestHandlerTimeoutSecs: 60,
            launchContext: {
                launchOptions: {
                    headless: true,
                },
            },
            async requestHandler({ page, request }) {
                await page.waitForLoadState('networkidle');
                await this.delay(1000);

                // Try to find navigation elements
                const navItems = await page.$$eval(
                    'nav a, header a, .navigation a, .nav-item a, [role="navigation"] a',
                    (elements) =>
                        elements
                            .map((el) => ({
                                title: el.textContent?.trim() || '',
                                url: (el as HTMLAnchorElement).href || '',
                            }))
                            .filter((item) => item.title && item.url),
                );

                // Filter and deduplicate
                const seen = new Set<string>();
                navItems.forEach((item) => {
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
            },
        });

        try {
            await crawler.run([this.baseUrl]);
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

        const crawler = new PlaywrightCrawler({
            maxRequestsPerCrawl: 1,
            requestHandlerTimeoutSecs: 60,
            launchContext: {
                launchOptions: {
                    headless: true,
                },
            },
            async requestHandler({ page }) {
                await page.waitForLoadState('networkidle');
                await this.delay(1000);

                // Look for category links
                const categories = await page.$$eval(
                    '.category a, .category-list a, .subcategory a, [data-category] a',
                    (elements) =>
                        elements
                            .map((el) => {
                                const title = el.textContent?.trim() || '';
                                const url = (el as HTMLAnchorElement).href || '';
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
                            .filter((item) => item.title && item.url),
                );

                const seen = new Set<string>();
                categories.forEach((item) => {
                    const slug = this.createSlug(item.title);
                    if (!seen.has(slug)) {
                        seen.add(slug);
                        results.push({
                            ...item,
                            slug,
                        });
                    }
                });
            },
        });

        try {
            await crawler.run([url]);
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

        const crawler = new PlaywrightCrawler({
            maxRequestsPerCrawl: maxPages,
            requestHandlerTimeoutSecs: 60,
            launchContext: {
                launchOptions: {
                    headless: true,
                },
            },
            async requestHandler({ page, request }) {
                await page.waitForLoadState('networkidle');
                await this.delay(this.delayMs);

                // Extract products from the page
                const products = await page.$$eval(
                    '.product, .product-item, [data-product], .book-item',
                    (elements) =>
                        elements.map((el) => {
                            const titleEl = el.querySelector(
                                'h2, h3, .title, .product-title, .book-title',
                            );
                            const authorEl = el.querySelector(
                                '.author, .product-author, [data-author]',
                            );
                            const priceEl = el.querySelector(
                                '.price, .product-price, [data-price]',
                            );
                            const imageEl = el.querySelector('img');
                            const linkEl = el.querySelector('a');

                            const title = titleEl?.textContent?.trim() || '';
                            const author = authorEl?.textContent?.trim();
                            const priceText = priceEl?.textContent?.trim() || '';
                            const priceMatch = priceText.match(/[\d.]+/);
                            const price = priceMatch ? parseFloat(priceMatch[0]) : undefined;
                            const imageUrl = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src');
                            const productUrl = linkEl?.getAttribute('href') || '';

                            return {
                                title,
                                author,
                                price,
                                imageUrl,
                                productUrl,
                            };
                        }),
                );

                products.forEach((product) => {
                    if (product.title && product.productUrl) {
                        const fullUrl = product.productUrl.startsWith('http')
                            ? product.productUrl
                            : new URL(product.productUrl, request.loadedUrl).href;

                        const sourceId = this.extractProductId(fullUrl);

                        results.push({
                            sourceId,
                            title: product.title,
                            author: product.author,
                            price: product.price,
                            currency: 'GBP',
                            imageUrl: product.imageUrl,
                            sourceUrl: fullUrl,
                        });
                    }
                });

                // Try to find next page link
                const nextPageUrl = await page.$eval(
                    '.next, .pagination-next, a[rel="next"], .page-next',
                    (el) => (el as HTMLAnchorElement).href,
                ).catch(() => null);

                if (nextPageUrl && results.length < maxPages * 20) {
                    await crawler.addRequests([nextPageUrl]);
                }
            },
        });

        try {
            await crawler.run([url]);
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

        const crawler = new PlaywrightCrawler({
            maxRequestsPerCrawl: 1,
            requestHandlerTimeoutSecs: 60,
            launchContext: {
                launchOptions: {
                    headless: true,
                },
            },
            async requestHandler({ page }) {
                await page.waitForLoadState('networkidle');
                await this.delay(1000);

                // Extract description
                const description = await page
                    .$eval(
                        '.description, .product-description, [data-description]',
                        (el) => el.textContent?.trim(),
                    )
                    .catch(() => undefined);

                // Extract ISBN
                const isbn = await page
                    .$eval(
                        '[data-isbn], .isbn',
                        (el) => el.textContent?.trim(),
                    )
                    .catch(() => undefined);

                // Extract publisher
                const publisher = await page
                    .$eval(
                        '.publisher, [data-publisher]',
                        (el) => el.textContent?.trim(),
                    )
                    .catch(() => undefined);

                // Extract publication date
                const publicationDate = await page
                    .$eval(
                        '.publication-date, [data-publication-date]',
                        (el) => el.textContent?.trim(),
                    )
                    .catch(() => undefined);

                // Extract related products
                const relatedProducts = await page
                    .$$eval('.related-product a, .recommended a', (elements) =>
                        elements.map((el) => (el as HTMLAnchorElement).href),
                    )
                    .catch(() => []);

                // Extract specs
                const specs = await page
                    .$$eval('.specs tr, .product-specs tr', (rows) => {
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
                    .$$eval('.review, .product-review, [data-review]', (elements) =>
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
                                text: textEl?.textContent?.trim(),
                                title: titleEl?.textContent?.trim(),
                                reviewDate: dateEl?.textContent?.trim(),
                            };
                        }),
                    )
                    .catch(() => []);

                reviews.push(...reviewElements.filter((r) => r.rating > 0));
            },
        });

        try {
            await crawler.run([url]);
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
