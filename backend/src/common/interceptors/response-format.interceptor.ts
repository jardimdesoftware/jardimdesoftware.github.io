import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '@/common/decorators/response-message.decorator';

interface StandardResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
}

/**
 * Interceptor global que padroniza o formato de todas as respostas da API.
 *
 * Comportamento:
 * - Se a resposta já está formatada (tem statusCode e message), não modifica
 * - Se for uma resposta paginada ({ data, total }), não envelopa
 * - Caso contrário, envolve a resposta em { statusCode, message, data }
 */
@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (this.isAlreadyFormatted(data)) {
          return data;
        }

        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        const customMessage = this.reflector.getAllAndOverride<string>(
          RESPONSE_MESSAGE_KEY,
          [context.getHandler(), context.getClass()],
        );

        const message = customMessage || this.getDefaultMessage(statusCode);

        return {
          statusCode,
          message,
          data,
        } as StandardResponse;
      }),
    );
  }

  private isAlreadyFormatted(data: any): data is StandardResponse {
    if (
      data &&
      typeof data === 'object' &&
      'statusCode' in data &&
      'message' in data
    ) {
      return true;
    }

    if (data && typeof data === 'object' && 'data' in data && 'total' in data) {
      return true;
    }

    return false;
  }

  private getDefaultMessage(statusCode: number): string {
    const messages: Record<number, string> = {
      [HttpStatus.OK]: 'Operação realizada com sucesso',
      [HttpStatus.CREATED]: 'Recurso criado com sucesso',
      [HttpStatus.NO_CONTENT]: 'Operação realizada com sucesso',
      [HttpStatus.ACCEPTED]: 'Requisição aceita para processamento',
      [HttpStatus.BAD_REQUEST]: 'Requisição inválida',
      [HttpStatus.UNAUTHORIZED]: 'Acesso não autorizado',
      [HttpStatus.FORBIDDEN]: 'Acesso proibido',
      [HttpStatus.NOT_FOUND]: 'Recurso não encontrado',
      [HttpStatus.CONFLICT]: 'Conflito na operação',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Erro interno do servidor',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'Servidor indisponível',
    };

    return messages[statusCode] || 'Operação realizada com sucesso';
  }
}
