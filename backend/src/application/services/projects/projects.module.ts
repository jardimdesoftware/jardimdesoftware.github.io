import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { ProjectsService } from './projects.service';

@Module({
  imports: [InfrastructureModule],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsApplicationModule {}
