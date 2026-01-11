import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
    @ApiPropertyOptional({ default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;
}

export class ScrapeRequestDto {
    @ApiProperty({ description: 'URL to scrape' })
    @IsString()
    url: string;

    @ApiPropertyOptional({ description: 'Force refresh even if cached' })
    @IsOptional()
    force?: boolean;
}

export class ProductFilterDto extends PaginationDto {
    @ApiPropertyOptional({ description: 'Search query' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Category ID filter' })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiPropertyOptional({ description: 'Minimum price' })
    @IsOptional()
    @Type(() => Number)
    minPrice?: number;

    @ApiPropertyOptional({ description: 'Maximum price' })
    @IsOptional()
    @Type(() => Number)
    maxPrice?: number;

    @ApiPropertyOptional({ description: 'Minimum rating' })
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    @Max(5)
    minRating?: number;

    @ApiPropertyOptional({ description: 'Author filter' })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiPropertyOptional({ description: 'Sort by field', enum: ['price', 'title', 'createdAt'] })
    @IsOptional()
    @IsString()
    sortBy?: 'price' | 'title' | 'createdAt';

    @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'] })
    @IsOptional()
    @IsString()
    sortOrder?: 'ASC' | 'DESC';
}

export class CreateViewHistoryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    userId?: string;

    @ApiProperty()
    @IsString()
    sessionId: string;

    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty()
    pathJson: Record<string, any>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    productId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    categoryId?: string;
}
