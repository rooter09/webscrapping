import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Product } from '../../entities/product.entity';
import { ProductFilterDto, ScrapeRequestDto } from '../../common/dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    @ApiOperation({ summary: 'Get all products with filters and pagination' })
    @ApiResponse({ status: 200, description: 'Returns paginated products' })
    async findAll(@Query() filterDto: ProductFilterDto) {
        return this.productService.findAll(filterDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Returns product with details' })
    async findOne(@Param('id') id: string): Promise<Product> {
        return this.productService.findOne(id);
    }

    @Get('source/:sourceId')
    @ApiOperation({ summary: 'Get product by source ID' })
    @ApiParam({ name: 'sourceId', description: 'Product source ID' })
    @ApiResponse({ status: 200, description: 'Returns product' })
    async findBySourceId(@Param('sourceId') sourceId: string): Promise<Product | null> {
        return this.productService.findBySourceId(sourceId);
    }

    @Post('scrape')
    @ApiOperation({ summary: 'Scrape products from a category page' })
    @ApiResponse({ status: 201, description: 'Products scraped successfully' })
    async scrapeProducts(
        @Body() dto: ScrapeRequestDto,
        @Query('categoryId') categoryId?: string,
        @Query('maxPages') maxPages?: number,
    ): Promise<Product[]> {
        return this.productService.scrapeAndStoreProducts(
            dto.url,
            categoryId,
            maxPages || 5,
            dto.force,
        );
    }

    @Post(':id/refresh')
    @ApiOperation({ summary: 'Refresh product details and reviews' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Product refreshed successfully' })
    async refreshProduct(@Param('id') id: string): Promise<Product> {
        return this.productService.refreshProduct(id);
    }

    @Post(':id/scrape-detail')
    @ApiOperation({ summary: 'Scrape detailed product information' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Product detail scraped' })
    async scrapeDetail(
        @Param('id') id: string,
        @Query('force') force?: boolean,
    ): Promise<Product> {
        return this.productService.scrapeAndStoreProductDetail(id, force === true);
    }
}
