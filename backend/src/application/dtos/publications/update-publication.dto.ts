import { PartialType } from '@nestjs/swagger';
import { CreatePublicationDto } from '@/application/dtos/publications/create-publication.dto';

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {}
