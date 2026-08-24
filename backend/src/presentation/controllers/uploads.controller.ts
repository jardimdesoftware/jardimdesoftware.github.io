import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { UPLOADS_DIR, UPLOADS_URL_PREFIX } from '@/common/config/uploads.config';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@ApiTags('Uploads (Admin)')
@ApiBearerAuth()
@Controller('admin/uploads')
export class UploadsController {
  @Post()
  @ApiOperation({ summary: 'Enviar uma imagem (capa de notícia, foto, etc.)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Imagem enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo ausente ou inválido' })
  @ResponseMessage('Imagem enviada com sucesso')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              'Formato de imagem não suportado. Use JPEG, PNG, WEBP ou GIF.',
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    return { url: `${UPLOADS_URL_PREFIX}/${file.filename}` };
  }
}
