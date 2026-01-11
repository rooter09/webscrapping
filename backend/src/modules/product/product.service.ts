import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductDetail } from '../../entities/product-detail.entity';
import { Review } from '../../entities/review.entity';
import { ScraperService } from '../../scraper/scraper.service';
import { ConfigService } from '@nestjs/config';
import { ProductFilterDto } from '../../common/dto';

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);
    private readonly cacheTtlHours: number;

    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductDetail)
        private productDetailRepository: Repository<ProductDetail>,
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        private scraperService: ScraperService,
        private configService: ConfigService,
    ) {
        this.cacheTtlHours = this.configService.get<number>('CACHE_TTL_HOURS', 24);
    }

    async findAll(filterDto: ProductFilterDto): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const { page = 1, limit = 20, search, categoryId, minPrice, maxPrice, minRating, author, sortBy = 'createdAt', sortOrder = 'DESC' } = filterDto;

        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.detail', 'detail');

        // Apply filters
        if (search) {
            queryBuilder.andWhere(
                '(product.title ILIKE :search OR product.author ILIKE :search)',
                { search: `%${search}%` },
            );
        }

        if (categoryId) {
            queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
        }

        if (minPrice !== undefined) {
            queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
        }

        if (maxPrice !== undefined) {
            queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
        }

        if (minRating !== undefined) {
            queryBuilder.andWhere('detail.ratingsAvg >= :minRating', { minRating });
        }

        if (author) {
            queryBuilder.andWhere('product.author ILIKE :author', { author: `%${author}%` });
        }

        // Apply sorting
        const sortField = sortBy === 'price' ? 'product.price' : sortBy === 'title' ? 'product.title' : 'product.createdAt';
        queryBuilder.orderBy(sortField, sortOrder);

        // Apply pagination
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'detail', 'reviews'],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    async findBySourceId(sourceId: string): Promise<Product | null> {
        return this.productRepository.findOne({
            where: { sourceId },
            relations: ['category', 'detail', 'reviews'],
        });
    }

    async scrapeAndStoreProducts(
        url: string,
        categoryId?: string,
        maxPages: number = 5,
    ): Promise<Product[]> {
        this.logger.log(`Scraping products from: ${url}`);

        // Perform scrape
        const scrapedData = await this.scraperService.scrapeProducts(url, maxPages);
        const savedItems: Product[] = [];

        for (const item of scrapedData) {
            let product = await this.productRepository.findOne({
                where: { sourceId: item.sourceId },
            });

            if (product) {
                // Update existing
                product.title = item.title;
                product.author = item.author || undefined;
                product.price = item.price || undefined;
                product.currency = item.currency;
                product.imageUrl = item.imageUrl || undefined;
                product.sourceUrl = item.sourceUrl;
                product.lastScrapedAt = new Date();
            } else {
                // Create new
                product = this.productRepository.create({
                    sourceId: item.sourceId,
                    title: item.title,
                    author: item.author,
                    price: item.price,
                    currency: item.currency,
                    imageUrl: item.imageUrl,
                    sourceUrl: item.sourceUrl,
                    categoryId,
                    lastScrapedAt: new Date(),
                });
            }

            savedItems.push(await this.productRepository.save(product));
        }

        this.logger.log(`Saved ${savedItems.length} products`);
        return savedItems;
    }

    async scrapeAndStoreProductDetail(productId: string, force: boolean = false): Promise<Product> {
        const product = await this.findOne(productId);

        // Check cache
        if (!force && product.detail && product.lastScrapedAt) {
            const hoursSinceLastScrape =
                (Date.now() - product.lastScrapedAt.getTime()) / (1000 * 60 * 60);

            if (hoursSinceLastScrape < this.cacheTtlHours) {
                this.logger.log(
                    `Using cached product detail (${hoursSinceLastScrape.toFixed(1)}h old)`,
                );
                return product;
            }
        }

        this.logger.log(`Scraping product detail for: ${product.sourceUrl}`);

        // Perform scrape
        const { detail: scrapedDetail, reviews: scrapedReviews } =
            await this.scraperService.scrapeProductDetail(product.sourceUrl);

        // Save or update product detail
        let productDetail = await this.productDetailRepository.findOne({
            where: { productId: product.id },
        });

        if (productDetail) {
            Object.assign(productDetail, scrapedDetail);
            productDetail.reviewsCount = scrapedReviews.length;
            if (scrapedReviews.length > 0) {
                const avgRating =
                    scrapedReviews.reduce((sum, r) => sum + r.rating, 0) /
                    scrapedReviews.length;
                productDetail.ratingsAvg = parseFloat(avgRating.toFixed(2));
            }
        } else {
            productDetail = this.productDetailRepository.create({
                productId: product.id,
                ...scrapedDetail,
                reviewsCount: scrapedReviews.length,
                ratingsAvg:
                    scrapedReviews.length > 0
                        ? parseFloat(
                            (
                                scrapedReviews.reduce((sum, r) => sum + r.rating, 0) /
                                scrapedReviews.length
                            ).toFixed(2),
                        )
                        : undefined,
            });
        }

        await this.productDetailRepository.save(productDetail);

        // Save reviews
        // Delete old reviews first
        await this.reviewRepository.delete({ productId: product.id });

        for (const reviewData of scrapedReviews) {
            const review = this.reviewRepository.create({
                productId: product.id,
                author: reviewData.author,
                rating: reviewData.rating,
                text: reviewData.text,
                title: reviewData.title,
                verified: reviewData.verified || false,
                reviewDate: reviewData.reviewDate
                    ? new Date(reviewData.reviewDate)
                    : undefined,
            });
            await this.reviewRepository.save(review);
        }

        // Update product's last scraped timestamp
        product.lastScrapedAt = new Date();
        await this.productRepository.save(product);

        this.logger.log(
            `Saved product detail with ${scrapedReviews.length} reviews`,
        );

        return this.findOne(product.id);
    }

    async refreshProduct(id: string): Promise<Product> {
        return this.scrapeAndStoreProductDetail(id, true);
    }
}
