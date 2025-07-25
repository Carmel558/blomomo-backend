import { INestApplication, Injectable } from '@nestjs/common';
import { TEndpoint } from './management/endpoint/type/endpoint.type';

@Injectable()
export class AppService {
  private app?: INestApplication;

  setApp(app: INestApplication): void {
    this.app = app;
  }

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Liste des routes de l'application
   * @returns Liste formattée des routes et verbes HTTP
   */
  public getRoutes(): TEndpoint[] {
    if (!this.app) {
      throw new Error('no app');
    }

    const server = this.app.getHttpServer();
    const router = server._events.request._router;

    const availableRoutes: TEndpoint[] = [];

    for (const layer of router.stack) {
      if (layer.route && layer.route.path) {
        for (const method of layer.route.stack) {
          const availableRoute = {
            verb: method.method.toUpperCase(),
            route: layer.route.path,
          };

          availableRoutes.push(availableRoute);
        }
      }
    }

    return availableRoutes;
  }
}
