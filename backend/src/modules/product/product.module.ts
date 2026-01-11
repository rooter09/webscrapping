import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { ProductDetail } from '../../entities/product-detail.entity';
import { Review } from '../../entities/review.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ScraperModule } from '../../scraper/scraper.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductDetail, Review]),
        ScraperModule,
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule { }
