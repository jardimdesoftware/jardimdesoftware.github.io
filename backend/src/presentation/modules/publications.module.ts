import { Module } from '@nestjs/common';
import { PublicationsApplicationModule } from '@/application/services/publications/publications.module';
import {
  PublicationsController,
  PublicationsAdminController,
} from '@/presentation/controllers/publications.controller';

@Module({
  imports: [PublicationsApplicationModule],
  controllers: [PublicationsController, PublicationsAdminController],
})
export class PublicationsPresentationModule {}
