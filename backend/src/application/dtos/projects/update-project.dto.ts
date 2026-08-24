import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from '@/application/dtos/projects/create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
