import { Module } from '@nestjs/common';
import { EmailServiceImpl } from './domain/email.service.impl';
import { NotificationController } from './interfaces/notification.controller';
import { EmailService } from './domain/email.service';
import { SesModule } from '../common/ses/ses.module';
import { TemplateController } from './interfaces/template.controller';

@Module({
  imports: [SesModule],
  providers: [{ provide: EmailService, useClass: EmailServiceImpl }],
  controllers: [NotificationController, TemplateController],
})
export class EmailModule {}
