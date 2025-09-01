import express, { Application, NextFunction, Request, Response } from 'express';
import appRoutes from './globals/routes/appRoutes';
import setupMongoDB from './globals/config/database';
import { CustomError, NotFoundException } from './globals/cores/error.core';
import HttpConstants from './globals/constants/http.constants';

export class Server {
  private _app: Application;
  private _port: number = Number(process.env.PORT) || 5050;

  constructor() {
    this._app = express();
  }

  public async startServer(): Promise<void> {
    await setupMongoDB();
    this._setupMiddleware();
    this._setupRoutes();
    this._setupGlobalErrorHandler();
    this._listenStart();
  }

  private _setupMiddleware(): void {
    // CONFIG JSON AND URL ENCODED
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
  }
  private _setupRoutes(): void {
    appRoutes(this._app);
  }
  private _setupGlobalErrorHandler(): void {
    // all = [get, post, put, delete, patch]
    this._app.all('*', (req, res, next) => {
      next(new NotFoundException(`The URL ${req.originalUrl} is not found with this method ${req.method}`));
    });

    // Global error handler for all errors: res, req, next
    this._app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
          message: err.message
        });
      }
      return res.status(HttpConstants.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error'
      });
    });
  }

  private _listenStart(): void {
    const port = this._port;

    this._app.listen(port, () => {
      console.log(`Server is running on port ${port} `);
      console.log(`URL: http://localhost:${port}/api/v1`);
    });
  }
}
