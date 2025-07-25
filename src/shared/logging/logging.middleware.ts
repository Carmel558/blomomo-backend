import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { UserRequest } from "src/management/auth/interface/user-request.interface";

@Injectable()
export class ErrorLoggingMiddleware implements NestMiddleware {
  constructor(
    @InjectPinoLogger(ErrorLoggingMiddleware.name)
    private readonly logger: PinoLogger
  ) {}

  async use(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    res.on("finish", () => {
      const errorStatuses = [400, 401, 403, 404, 500];

      if (errorStatuses.includes(res.statusCode)) {
        this.logger.error({
          ...res.err,
          requestBody: req.body,
        });
      }
    });

    next();
  }
}
