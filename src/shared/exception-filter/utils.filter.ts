import { HttpException, HttpStatus } from '@nestjs/common';

export const getStatusCode = (exception: unknown): number =>
  exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;

export const getErrorMessage = (exception: unknown): string =>
  String(exception);
