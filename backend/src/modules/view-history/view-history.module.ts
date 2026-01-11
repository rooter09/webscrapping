import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewHistory } from '../../entities/view-history.entity';
import { ViewHistoryController } from './view-history.controller';
import { ViewHistoryService } from './view-history.service';

@Module({
    imports: [TypeOrmModule.forFeature([ViewHistory])],
    controllers: [ViewHistoryController],
    providers: [ViewHistoryService],
    exports: [ViewHistoryService],
})
export class ViewHistoryModule { }
