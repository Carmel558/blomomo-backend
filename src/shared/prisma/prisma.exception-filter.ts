import { IncomingMessage } from "http";

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Response } from "express";
import { getStatusCode } from "../exception-filter/utils.filter";
import {
  FAILED_TO_VALIDATE_QUERY_CODE,
  FAILED_TO_VALIDATE_QUERY_TYPE,
  FOREIGN_KEY_FAILED_CODE,
  FOREIGN_KEY_FAILED_TYPE,
  RECORD_NOT_FOUND_CODE,
  RECORD_NOT_FOUND_TYPE,
  UNIQUE_CONSTRAINT_FAILED_CODE,
  UNIQUE_CONSTRAINT_FAILED_TYPE,
  UNKNOWN_ERROR_MESSAGE,
  UNKNOWN_ERROR_TYPE,
} from "./resources/filter.resources";

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IncomingMessage>();
    let code = getStatusCode(exception);
    let errorType: string = UNKNOWN_ERROR_TYPE;
    let message: string = UNKNOWN_ERROR_MESSAGE;

    const prismaErrorType = exception.code;

    switch (prismaErrorType) {
      case UNIQUE_CONSTRAINT_FAILED_CODE:
        errorType = UNIQUE_CONSTRAINT_FAILED_TYPE;
        if (
          Array.isArray(exception.meta?.["target"]) &&
          exception.meta?.["target"][0]
        ) {
          message = `${errorType} on the field ${exception.meta["target"][0]}`;
        }
        break;

      case FOREIGN_KEY_FAILED_CODE:
        errorType = FOREIGN_KEY_FAILED_TYPE;
        if (exception.meta)
          message = `${errorType} on the field ${exception.meta?.["field_name"]}`;
        break;

      case FAILED_TO_VALIDATE_QUERY_CODE:
        errorType = FAILED_TO_VALIDATE_QUERY_TYPE;
        message = `${errorType}`;
        break;

      case RECORD_NOT_FOUND_CODE:
        code = HttpStatus.NOT_FOUND;
        errorType = RECORD_NOT_FOUND_TYPE;
        message = `${exception.meta?.["cause"] ?? exception.message}`;
        break;

      default:
        break;
    }

    response.status(code).json({
      error: {
        timestamp: new Date().toISOString(),
        path: request.url,
        code,
        errorType,
        message,
      },
    });
  }
}
