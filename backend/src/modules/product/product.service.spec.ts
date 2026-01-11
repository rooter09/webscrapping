/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductDetail } from '../../entities/product-detail.entity';
import { Review } from '../../entities/review.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScraperService } from '../../scraper/scraper.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
    let service: ProductService;

    const mockProduct = {
        id: '1',
        sourceId: 'WOB123',
        title: 'Test Book',
        author: 'Test Author',
        price: 9.99,
        currency: 'GBP',
        imageUrl: 'https://example.com/image.jpg',
        sourceUrl: 'https://www.worldofbooks.com/product/123',
        categoryId: 'cat1',
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockProductDetail = {
        id: '1',
        productId: '1',
        description: 'Test description',
        specs: {},
        ratingsAvg: 4.5,
        reviewsCount: 10,
        isbn: '1234567890',
        publisher: 'Test Publisher',
        publicationDate: new Date('2020-01-01'),
    };

    const mockProductRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const mockProductDetailRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    };

    const mockReviewRepository = {
        find: jest.fn(),
        save: jest.fn(),
    };

    const mockScraperService = {
        scrapeProducts: jest.fn(),
        scrapeProductDetail: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockReturnValue(24),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockProductRepository,
                },
                {
                    provide: getRepositoryToken(ProductDetail),
                    useValue: mockProductDetailRepository,
                },
                {
                    provide: getRepositoryToken(Review),
                    useValue: mockReviewRepository,
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

        service = module.get<ProductService>(ProductService);
        // Repositories are mocked but not directly used in tests
        // productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
        // productDetailRepository = module.get<Repository<ProductDetail>>(getRepositoryToken(ProductDetail));
        // reviewRepository = module.get<Repository<Review>>(getRepositoryToken(Review));
        // scraperService = module.get<ScraperService>(ScraperService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated products', async () => {
            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[mockProduct], 1]),
            };

            mockProductRepository.createQueryBuilder.mockReturnValue(
                mockQueryBuilder,
            );

            const result = await service.findAll({
                page: 1,
                limit: 10,
            });

            expect(result.data).toEqual([mockProduct]);
            expect(result.total).toBe(1);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
        });

        it('should apply search filter', async () => {
            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            };

            mockProductRepository.createQueryBuilder.mockReturnValue(
                mockQueryBuilder,
            );

            await service.findAll({
                page: 1,
                limit: 10,
                search: 'test',
            });

            expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a product with details', async () => {
            mockProductRepository.findOne.mockResolvedValue(mockProduct);
            mockProductDetailRepository.findOne.mockResolvedValue(mockProductDetail);
            mockReviewRepository.find.mockResolvedValue([]);

            const result = await service.findOne('1');

            expect(result).toBeDefined();
            expect(result.id).toBe('1');
        });

        it('should throw NotFoundException when product not found', async () => {
            mockProductRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('scrapeAndStoreProducts', () => {
        it('should scrape products from a category', async () => {
            const scrapedProducts = [{
                title: 'Book',
                author: 'Author',
                price: 10,
                imageUrl: 'http://example.com/img.jpg',
                sourceUrl: 'http://example.com/product',
                sourceId: 'WOB123'
            }];
            mockScraperService.scrapeProducts.mockResolvedValue(scrapedProducts);
            mockProductRepository.findOne.mockResolvedValue(null);
            mockProductRepository.create.mockReturnValue(mockProduct);
            mockProductRepository.save.mockResolvedValue(mockProduct);

            const result = await service.scrapeAndStoreProducts(
                'https://example.com/category',
                'cat1',
                1
            );

            expect(result).toBeDefined();
            expect(mockScraperService.scrapeProducts).toHaveBeenCalled();
        });
    });

    describe('refreshProduct', () => {
        it('should refresh product data by calling scrapeAndStoreProductDetail', async () => {
            // Spy on the service method that refreshProduct calls
            const scrapeAndStoreDetailSpy = jest
                .spyOn(service, 'scrapeAndStoreProductDetail')
                .mockResolvedValue(mockProduct as Product);

            const result = await service.refreshProduct('1');

            expect(result).toBeDefined();
            expect(scrapeAndStoreDetailSpy).toHaveBeenCalledWith('1', true);

            scrapeAndStoreDetailSpy.mockRestore();
        });
    });
});
