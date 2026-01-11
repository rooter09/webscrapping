/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NavigationService } from './navigation.service';
import { Repository } from 'typeorm';
import { Navigation } from '../../entities/navigation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScraperService } from '../../scraper/scraper.service';
import { ConfigService } from '@nestjs/config';

describe('NavigationService', () => {
    let service: NavigationService;
    let repository: Repository<Navigation>;
    let scraperService: ScraperService;

    const mockNavigation = {
        id: '1',
        title: 'Books',
        slug: 'books',
        url: 'https://www.worldofbooks.com/en-gb/books',
        lastScrapedAt: new Date(),
        categories: [],
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
        scrapeNavigation: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockReturnValue(24),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NavigationService,
                {
                    provide: getRepositoryToken(Navigation),
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

        service = module.get<NavigationService>(NavigationService);
        repository = module.get<Repository<Navigation>>(
            getRepositoryToken(Navigation),
        );
        scraperService = module.get<ScraperService>(ScraperService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of navigation items', async () => {
            mockRepository.find.mockResolvedValue([mockNavigation]);

            const result = await service.findAll();

            expect(result).toEqual([mockNavigation]);
            expect(repository.find).toHaveBeenCalled();
        });

        it('should return empty array when no navigation items exist', async () => {
            mockRepository.find.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a navigation item by id', async () => {
            mockRepository.findOne.mockResolvedValue(mockNavigation);

            const result = await service.findOne('1');

            expect(result).toEqual(mockNavigation);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                relations: ['categories'],
            });
        });

        it('should return null when navigation not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const result = await service.findOne('999');

            expect(result).toBeNull();
        });
    });

    describe('findBySlug', () => {
        it('should return a navigation item by slug', async () => {
            mockRepository.findOne.mockResolvedValue(mockNavigation);

            const result = await service.findBySlug('books');

            expect(result).toEqual(mockNavigation);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { slug: 'books' },
                relations: ['categories'],
            });
        });

        it('should return null when slug not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const result = await service.findBySlug('invalid');

            expect(result).toBeNull();
        });
    });

    describe('scrapeAndStore', () => {
        it('should trigger navigation scraping', async () => {
            const scrapedData = [{ title: 'Books', slug: 'books', url: 'http://example.com' }];
            mockScraperService.scrapeNavigation.mockResolvedValue(scrapedData);
            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(mockNavigation);
            mockRepository.save.mockResolvedValue(mockNavigation);

            const result = await service.scrapeAndStore(true);

            expect(result).toBeDefined();
            expect(scraperService.scrapeNavigation).toHaveBeenCalled();
        });

        it('should use cached data when available', async () => {
            mockRepository.find.mockResolvedValue([mockNavigation]);

            const result = await service.scrapeAndStore(false);

            expect(result).toEqual([mockNavigation]);
        });
    });
});
