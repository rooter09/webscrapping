import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../../entities/navigation.entity';
import { ScraperService } from '../../scraper/scraper.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NavigationService {
    private readonly logger = new Logger(NavigationService.name);
    private readonly cacheTtlHours: number;

    constructor(
        @InjectRepository(Navigation)
        private navigationRepository: Repository<Navigation>,
        private scraperService: ScraperService,
        private configService: ConfigService,
    ) {
        this.cacheTtlHours = this.configService.get<number>('CACHE_TTL_HOURS', 24);
    }

    async findAll(): Promise<Navigation[]> {
        return this.navigationRepository.find({
            order: { title: 'ASC' },
            relations: ['categories'],
        });
    }

    async findOne(id: string): Promise<Navigation | null> {
        return this.navigationRepository.findOne({
            where: { id },
            relations: ['categories'],
        });
    }

    async findBySlug(slug: string): Promise<Navigation | null> {
        return this.navigationRepository.findOne({
            where: { slug },
            relations: ['categories'],
        });
    }

    async scrapeAndStore(force: boolean = false): Promise<Navigation[]> {
        this.logger.log('Starting navigation scrape...');

        // Check if we need to scrape
        if (!force) {
            const existing = await this.navigationRepository.find();
            if (existing.length > 0) {
                const mostRecent = existing.reduce((latest, current) =>
                    current.lastScrapedAt > latest.lastScrapedAt ? current : latest,
                );

                const hoursSinceLastScrape =
                    (Date.now() - mostRecent.lastScrapedAt.getTime()) / (1000 * 60 * 60);

                if (hoursSinceLastScrape < this.cacheTtlHours) {
                    this.logger.log(
                        `Using cached navigation (${hoursSinceLastScrape.toFixed(1)}h old)`,
                    );
                    return existing;
                }
            }
        }

        // Perform scrape
        const scrapedData = await this.scraperService.scrapeNavigation();
        const savedItems: Navigation[] = [];

        for (const item of scrapedData) {
            let navigation = await this.navigationRepository.findOne({
                where: { slug: item.slug },
            });

            if (navigation) {
                navigation.title = item.title;
                navigation.url = item.url;
                navigation.lastScrapedAt = new Date();
            } else {
                navigation = this.navigationRepository.create({
                    title: item.title,
                    url: item.url,
                    slug: item.slug,
                    lastScrapedAt: new Date(),
                });
            }

            savedItems.push(await this.navigationRepository.save(navigation));
        }

        this.logger.log(`Saved ${savedItems.length} navigation items`);
        return savedItems;
    }

    async getOrScrape(): Promise<Navigation[]> {
        const existing = await this.findAll();
        if (existing.length > 0) {
            return existing;
        }
        return this.scrapeAndStore(false);
    }
}
