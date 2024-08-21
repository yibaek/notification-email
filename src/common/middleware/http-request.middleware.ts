import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import commonConfig from '../../config/common.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class HttpRequestMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Email Notification Server Request');

  constructor(
    @Inject(commonConfig.KEY)
    private config: ConfigType<typeof commonConfig>,
  ) {}

  use(req: Request, res: Response, next: (error?: any) => void): any {
    if (
      this.config.nodeEnv === 'development' ||
      this.config.nodeEnv === 'test'
    ) {
      this.logger.debug(
        `${req.method} ${req.originalUrl}, info: ${JSON.stringify({
          body: req.body ?? null,
        })}`,
      );
    }

    next();
  }
}
