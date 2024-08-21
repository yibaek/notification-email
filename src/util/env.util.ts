import * as dotenv from 'dotenv';
import { isEmpty } from 'lodash';

dotenv.config();

export class EnvUtil {
  private constructor() {}

  static getEnvPath(): string {
    const _this = new this();

    if (_this.notExistNodeEnv() || EnvUtil.isDevelopment()) {
      return '.env.development';
    } else if (EnvUtil.isTest()) {
      return '.env.test';
    } else {
      return '.env.production';
    }
  }

  static isDevelopment(nodeEnv?: string) {
    return ['development'].includes(
      nodeEnv ? nodeEnv : process.env.NODE_ENV ?? '',
    );
  }

  static isTest(nodeEnv?: string) {
    return ['test'].includes(nodeEnv ? nodeEnv : process.env.NODE_ENV ?? '');
  }

  static isProduction(nodeEnv?: string) {
    return ['production'].includes(
      nodeEnv ? nodeEnv : process.env.NODE_ENV ?? '',
    );
  }

  static getNodeEnv() {
    const nodeEnv = process.env.NODE_ENV ?? 'development';
    if (nodeEnv === 'development') {
      return 'development';
    } else if (nodeEnv === 'production') {
      return 'production';
    }

    return 'test';
  }

  private notExistNodeEnv() {
    return isEmpty(process.env.NODE_ENV);
  }
}
