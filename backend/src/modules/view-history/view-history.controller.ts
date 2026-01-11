import { Controller, Get, Post, Query, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ViewHistoryService } from './view-history.service';
import { ViewHistory } from '../../entities/view-history.entity';
import { CreateViewHistoryDto } from '../../common/dto';

@ApiTags('view-history')
@Controller('view-history')
export class ViewHistoryController {
    constructor(private readonly viewHistoryService: ViewHistoryService) { }

    @Post()
    @ApiOperation({ summary: 'Record a page view' })
    @ApiResponse({ status: 201, description: 'View recorded successfully' })
    async create(@Body() dto: CreateViewHistoryDto): Promise<ViewHistory> {
        return this.viewHistoryService.create(dto);
    }

    @Get('session/:sessionId')
    @ApiOperation({ summary: 'Get view history by session ID' })
    @ApiResponse({ status: 200, description: 'Returns view history' })
    async findBySession(
        @Param('sessionId') sessionId: string,
        @Query('limit') limit?: number,
    ): Promise<ViewHistory[]> {
        return this.viewHistoryService.findBySession(sessionId, limit);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get view history by user ID' })
    @ApiResponse({ status: 200, description: 'Returns view history' })
    async findByUser(
        @Param('userId') userId: string,
        @Query('limit') limit?: number,
    ): Promise<ViewHistory[]> {
        return this.viewHistoryService.findByUser(userId, limit);
    }
}
