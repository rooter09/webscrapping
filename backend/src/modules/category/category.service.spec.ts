import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScraperService } from '../../scraper/scraper.service';
import { ConfigService } from '@nestjs/config';

describe('CategoryService', () => {
    let service: CategoryService;
    let repository: Repository<Category>;
    let scraperService: ScraperService;

    const mockCategory = {
        id: '1',
        navigationId: 'nav1',
        parentId: null,
        title: 'Fiction',
        slug: 'fiction',
        url: 'https://www.worldofbooks.com/en-gb/books/fiction',
        productCount: 100,
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    };

    const mockScraperService = {
        scrapeCategories: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockReturnValue(24),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockRepository,
                },
                {
                    provide: ScraperService,
                    useValue: mockScraperService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        repository = module.get<Repository<Category>>(getRepositoryToken(Category));
        scraperService = module.get<ScraperService>(ScraperService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all categories', async () => {
            mockRepository.find.mockResolvedValue([mockCategory]);

            const result = await service.findAll();

            expect(result).toEqual([mockCategory]);
            expect(repository.find).toHaveBeenCalled();
        });

        it('should filter by navigationId', async () => {
            mockRepository.find.mockResolvedValue([mockCategory]);

            const result = await service.findAll('nav1');

            expect(result).toEqual([mockCategory]);
            expect(repository.find).toHaveBeenCalledWith({
                where: { navigationId: 'nav1' },
                order: { title: 'ASC' },
                relations: ['navigation', 'parent', 'children'],
            });
        });
    });

    describe('findOne', () => {
        it('should return a category by id', async () => {
            mockRepository.findOne.mockResolvedValue(mockCategory);

            const result = await service.findOne('1');

            expect(result).toEqual(mockCategory);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                relations: ['navigation', 'parent', 'children', 'products'],
            });
        });

        it('should return null when category not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const result = await service.findOne('999');

            expect(result).toBeNull();
        });
    });

    describe('findBySlug', () => {
        it('should return a category by slug', async () => {
            mockRepository.findOne.mockResolvedValue(mockCategory);

            const result = await service.findBySlug('fiction');

            expect(result).toEqual(mockCategory);
        });

        it('should return null when slug not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const result = await service.findBySlug('invalid');

            expect(result).toBeNull();
        });
    });

    describe('findByParent', () => {
        it('should return child categories', async () => {
            const childCategory = { ...mockCategory, id: '2', parentId: '1' };
            mockRepository.find.mockResolvedValue([childCategory]);

            const result = await service.findByParent('1');

            expect(result).toEqual([childCategory]);
            expect(repository.find).toHaveBeenCalledWith({
                where: { parentId: '1' },
                order: { title: 'ASC' },
            });
        });
    });

    describe('scrapeAndStore', () => {
        it('should trigger category scraping', async () => {
            const scrapedData = [{ title: 'Fiction', slug: 'fiction', url: 'http://example.com', productCount: 100 }];
            mockScraperService.scrapeCategories.mockResolvedValue(scrapedData);
            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(mockCategory);
            mockRepository.save.mockResolvedValue(mockCategory);

            const result = await service.scrapeAndStore('https://example.com/books', 'nav1', undefined, true);

            expect(result).toBeDefined();
            expect(scraperService.scrapeCategories).toHaveBeenCalledWith('https://example.com/books');
        });

        it('should use cached data when available', async () => {
            mockRepository.find.mockResolvedValue([mockCategory]);

            const result = await service.scrapeAndStore('https://example.com/books', 'nav1', undefined, false);

            expect(result).toEqual([mockCategory]);
        });
    });
});
