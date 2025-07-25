import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { EMPTY, Observable, tap } from "rxjs";

@Injectable()
export class UserActionLoggingInterceptor<T> implements NestInterceptor<T, T> {
  constructor(private readonly loggerService: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const request = context.switchToHttp().getRequest();
    const [method]: string[] = Object.keys(request.route.methods);
    const actionObject = {
      user: request.user?.azureId,
      action: method,
      path: request.route?.path,
      requestBody: request.body,
    };

    return next
      .handle()
      .pipe(
        tap((data) =>
          method !== "get"
            ? this.loggerService.logger.info(
                JSON.stringify({ ...actionObject, responseBody: data })
              )
            : EMPTY
        )
      );
  }
}
