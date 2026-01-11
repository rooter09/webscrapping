import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { ScraperService } from '../../scraper/scraper.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name);
    private readonly cacheTtlHours: number;

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        private scraperService: ScraperService,
        private configService: ConfigService,
    ) {
        this.cacheTtlHours = this.configService.get<number>('CACHE_TTL_HOURS', 24);
    }

    async findAll(navigationId?: string): Promise<Category[]> {
        const where = navigationId ? { navigationId } : {};
        return this.categoryRepository.find({
            where,
            order: { title: 'ASC' },
            relations: ['navigation', 'parent', 'children'],
        });
    }

    async findOne(id: string): Promise<Category | null> {
        return this.categoryRepository.findOne({
            where: { id },
            relations: ['navigation', 'parent', 'children', 'products'],
        });
    }

    async findBySlug(slug: string): Promise<Category | null> {
        return this.categoryRepository.findOne({
            where: { slug },
            relations: ['navigation', 'parent', 'children', 'products'],
        });
    }

    async findByParent(parentId: string): Promise<Category[]> {
        return this.categoryRepository.find({
            where: { parentId },
            order: { title: 'ASC' },
        });
    }

    async scrapeAndStore(
        url: string,
        navigationId?: string,
        parentId?: string,
        force: boolean = false,
    ): Promise<Category[]> {
        this.logger.log(`Scraping categories from: ${url}`);

        // Check cache
        if (!force && navigationId) {
            const existing = await this.categoryRepository.find({
                where: { navigationId },
            });

            if (existing.length > 0) {
                const mostRecent = existing.reduce((latest, current) =>
                    current.lastScrapedAt > latest.lastScrapedAt ? current : latest,
                );

                const hoursSinceLastScrape =
                    (Date.now() - mostRecent.lastScrapedAt.getTime()) / (1000 * 60 * 60);

                if (hoursSinceLastScrape < this.cacheTtlHours) {
                    this.logger.log(
                        `Using cached categories (${hoursSinceLastScrape.toFixed(1)}h old)`,
                    );
                    return existing;
                }
            }
        }

        // Perform scrape
        const scrapedData = await this.scraperService.scrapeCategories(url);
        const savedItems: Category[] = [];

        for (const item of scrapedData) {
            let category = await this.categoryRepository.findOne({
                where: { slug: item.slug },
            });

            if (category) {
                category.title = item.title;
                category.url = item.url;
                category.productCount = item.productCount || 0;
                category.lastScrapedAt = new Date();
            } else {
                category = this.categoryRepository.create({
                    title: item.title,
                    url: item.url,
                    slug: item.slug,
                    navigationId,
                    parentId,
                    productCount: item.productCount || 0,
                    lastScrapedAt: new Date(),
                });
            }

            savedItems.push(await this.categoryRepository.save(category));
        }

        this.logger.log(`Saved ${savedItems.length} categories`);
        return savedItems;
    }
}
