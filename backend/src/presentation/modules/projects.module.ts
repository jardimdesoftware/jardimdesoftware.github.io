import { Module } from '@nestjs/common';
import { ProjectsApplicationModule } from '@/application/services/projects/projects.module';
import {
  ProjectsController,
  ProjectsAdminController,
} from '@/presentation/controllers/projects.controller';

@Module({
  imports: [ProjectsApplicationModule],
  controllers: [ProjectsController, ProjectsAdminController],
})
export class ProjectsPresentationModule {}
