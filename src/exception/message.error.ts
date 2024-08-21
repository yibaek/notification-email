import { HttpStatus } from '@nestjs/common';
import { OutCodeError } from './base.error';

export class PubSubMessageInvalidError extends OutCodeError {
  ////////////////////////////////////////////////
  //  Constructor
  ////////////////////////////////////////////////

  constructor() {
    super('error.invalid-parameter', HttpStatus.BAD_REQUEST);

    this.name = PubSubMessageInvalidError.name;
    Object.setPrototypeOf(this, PubSubMessageInvalidError.prototype);
  }
}
