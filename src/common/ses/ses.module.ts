import { Module } from '@nestjs/common';
import { SesService } from './ses.service';

@Module({
  imports: [],
  providers: [SesService],
  exports: [SesService],
})
export class SesModule {}
