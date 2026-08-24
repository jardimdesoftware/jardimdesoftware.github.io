import { PartialType } from '@nestjs/swagger';
import { CreateNewsPostDto } from '@/application/dtos/news/create-news-post.dto';

export class UpdateNewsPostDto extends PartialType(CreateNewsPostDto) {}
