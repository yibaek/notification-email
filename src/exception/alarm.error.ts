import { HttpStatus } from '@nestjs/common';
import { OutCodeError } from './base.error';

export class AlarmMessageTypeInvalidError extends OutCodeError {
  ////////////////////////////////////////////////
  //  Constructor
  ////////////////////////////////////////////////

  constructor() {
    super('error.invalid-parameter', HttpStatus.BAD_REQUEST);

    this.name = AlarmMessageTypeInvalidError.name;
    Object.setPrototypeOf(this, AlarmMessageTypeInvalidError.prototype);
  }
}
