import { Module } from '@nestjs/common';
import { UploadsController } from '@/presentation/controllers/uploads.controller';

@Module({
  controllers: [UploadsController],
})
export class UploadsPresentationModule {}
