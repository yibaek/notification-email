import { HttpStatus } from '@nestjs/common';
import { OutCodeError } from './base.error';

export class UnknownError extends OutCodeError {
  ////////////////////////////////////////////////
  //  Constructor
  ////////////////////////////////////////////////

  constructor() {
    super('error.unknown', HttpStatus.INTERNAL_SERVER_ERROR);

    this.name = UnknownError.name;
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}
