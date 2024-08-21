import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { OutCodeError } from '../../exception/base.error';
import { I18nService } from 'nestjs-i18n';
import { AxiosError } from 'axios';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly i18n: I18nService,
  ) {}

  async catch(exception: Error, host: ArgumentsHost): Promise<any> {
    const http = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    if (exception instanceof OutCodeError) {
      const { status, message, code } = await exception.toJSON(this.i18n);

      httpAdapter.reply(http.getResponse(), {
        status,
        message,
        code,
      });
    } else if (exception instanceof AxiosError) {
      httpAdapter.reply(http.getResponse(), {
        status: exception.status,
        message: exception.message ?? '',
        code: 'AxiosError',
      });
    } else {
      httpAdapter.reply(http.getResponse(), {
        status: 500,
        code: 'SystemError',
      });
    }

    console.error(exception);
  }
}
