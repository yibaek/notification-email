import { I18nService } from 'nestjs-i18n';

export class OutCodeError extends Error {
  ////////////////////////////////////////////////
  //  Constructor
  ////////////////////////////////////////////////

  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly args = {},
    public readonly data = {},
  ) {
    super(message);

    this.name = 'OutCodeError';
    Object.setPrototypeOf(this, OutCodeError.prototype);
  }

  ////////////////////////////////////////////////
  //  Public Method
  ////////////////////////////////////////////////

  public async toJSON(i18n: I18nService, lang = 'ko-KR') {
    return {
      status: this.statusCode,
      code: this.name,
      message: i18n.translate(this.message, {
        lang,
        args: this.args,
      }),
      data: this.data,
    };
  }
}
