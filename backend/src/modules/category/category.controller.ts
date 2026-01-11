import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Category } from '../../entities/category.entity';
import { ScrapeRequestDto } from '../../common/dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiQuery({ name: 'navigationId', required: false })
    @ApiResponse({ status: 200, description: 'Returns all categories' })
    async findAll(@Query('navigationId') navigationId?: string): Promise<Category[]> {
        return this.categoryService.findAll(navigationId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    @ApiResponse({ status: 200, description: 'Returns category' })
    async findOne(@Param('id') id: string): Promise<Category | null> {
        return this.categoryService.findOne(id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get category by slug' })
    @ApiParam({ name: 'slug', description: 'Category slug' })
    @ApiResponse({ status: 200, description: 'Returns category' })
    async findBySlug(@Param('slug') slug: string): Promise<Category | null> {
        return this.categoryService.findBySlug(slug);
    }

    @Get('parent/:parentId')
    @ApiOperation({ summary: 'Get subcategories by parent ID' })
    @ApiParam({ name: 'parentId', description: 'Parent category ID' })
    @ApiResponse({ status: 200, description: 'Returns subcategories' })
    async findByParent(@Param('parentId') parentId: string): Promise<Category[]> {
        return this.categoryService.findByParent(parentId);
    }

    @Post('scrape')
    @ApiOperation({ summary: 'Trigger category scrape' })
    @ApiResponse({ status: 201, description: 'Scrape completed successfully' })
    async scrape(
        @Body() dto: ScrapeRequestDto,
        @Query('navigationId') navigationId?: string,
        @Query('parentId') parentId?: string,
    ): Promise<Category[]> {
        return this.categoryService.scrapeAndStore(
            dto.url,
            navigationId,
            parentId,
            dto.force,
        );
    }
}
