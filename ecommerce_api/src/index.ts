import { Server } from './server';

export class EcommerceApplication {
  public run(): void {
    const server = new Server();

    server.startServer();
  }
}

const ecommerceApplication: EcommerceApplication = new EcommerceApplication();
ecommerceApplication.run();
