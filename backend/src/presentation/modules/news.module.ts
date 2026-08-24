import { Module } from '@nestjs/common';
import { NewsApplicationModule } from '@/application/services/news/news.module';
import {
  NewsController,
  NewsAdminController,
} from '@/presentation/controllers/news.controller';

@Module({
  imports: [NewsApplicationModule],
  controllers: [NewsController, NewsAdminController],
})
export class NewsPresentationModule {}
