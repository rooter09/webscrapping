import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';
import { Navigation } from '../../entities/navigation.entity';

@ApiTags('navigation')
@Controller('navigation')
export class NavigationController {
    constructor(private readonly navigationService: NavigationService) { }

    @Get()
    @ApiOperation({ summary: 'Get all navigation headings' })
    @ApiResponse({ status: 200, description: 'Returns all navigation items' })
    async findAll(): Promise<Navigation[]> {
        return this.navigationService.getOrScrape();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get navigation by ID' })
    @ApiParam({ name: 'id', description: 'Navigation ID' })
    @ApiResponse({ status: 200, description: 'Returns navigation item' })
    @ApiResponse({ status: 404, description: 'Navigation not found' })
    async findOne(@Param('id') id: string): Promise<Navigation | null> {
        return this.navigationService.findOne(id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get navigation by slug' })
    @ApiParam({ name: 'slug', description: 'Navigation slug' })
    @ApiResponse({ status: 200, description: 'Returns navigation item' })
    async findBySlug(@Param('slug') slug: string): Promise<Navigation | null> {
        return this.navigationService.findBySlug(slug);
    }

    @Post('scrape')
    @ApiOperation({ summary: 'Trigger navigation scrape' })
    @ApiResponse({ status: 201, description: 'Scrape completed successfully' })
    async scrape(@Query('force') force?: boolean): Promise<Navigation[]> {
        return this.navigationService.scrapeAndStore(force === true);
    }
}
