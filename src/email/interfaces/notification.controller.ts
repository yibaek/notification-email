import { Body, Controller, Inject, Post } from '@nestjs/common';
import { EmailService } from '../domain/email.service';

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  @Post()
  async sent(@Body() body: any) {
    await this.emailService.sent(body);
    return 'OK';
  }
}
