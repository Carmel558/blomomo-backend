import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { TEndpoint } from "./management/endpoint/type/endpoint.type";
import { Public } from "./shared/decorator/public.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get("routes")
  getRoutes(): TEndpoint[] {
    return this.appService.getRoutes();
  }
}
