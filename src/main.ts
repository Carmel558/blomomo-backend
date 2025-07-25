import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AppService } from "./app.service";
import helmet from "helmet";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ENVIRONMENT_VARIABLES } from "./shared/environment/environment.variables";
import "./shared/helper/bigint-json.helper";
import { PrismaExceptionFilter } from "./shared/prisma/prisma.exception-filter";
import { Logger, LoggerErrorInterceptor } from "nestjs-pino";
import { UserActionLoggingInterceptor } from "./shared/interceptor/user-action-logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  for (const envVar of ENVIRONMENT_VARIABLES) {
    if (!process.env[envVar]) {
      throw new Error(`Required environment variable ${envVar} is missing.`);
    }
  }

  const corsOptions: CorsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalInterceptors(new UserActionLoggingInterceptor(app.get(Logger)));
  app.enableCors(corsOptions);
  app.use(helmet());
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
      },

      exceptionFactory: (e) => {
        console.error(e);
        throw new BadRequestException(`Erreur de validation: ${e.toString()}`);
      },
    })
  );

  if (process.env["ENV"] !== "prod") {
    const config = new DocumentBuilder()
      .setTitle("Blo MoMo API Documentation")
      .setDescription("Blo MoMo API Documentation")
      .setVersion("1.0")
      .setLicense("MIT", "https://opensource.org/licenses/MIT")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/docs", app, document);
  }

  await app.listen(process.env["APP_PORT"] ?? 3000);

  const appService = app.get(AppService);
  appService.setApp(app);

  process.stdout.write("Application successfully started!\n");
}
bootstrap();
