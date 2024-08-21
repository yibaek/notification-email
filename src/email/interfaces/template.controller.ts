import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { EmailService } from '../domain/email.service';
import { EmailDto } from './email.dto';

@Controller('v1/template')
export class TemplateController {
  constructor(
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  @Put()
  async createTemplate(@Body() template: EmailDto.CreateTemplate) {
    try {
      await this.emailService.createTemplate(template);
      return 'Succeed!!';
    } catch (e: any) {
      throw e;
    }
  }

  @Patch()
  async updateTemplate(@Body() template: EmailDto.UpdateTemplate) {
    try {
      await this.emailService.updateTemplate(template);
      return 'Succeed!!';
    } catch (e: any) {
      throw e;
    }
  }

  @Delete('/:id')
  async deleteTemplate(@Param() template: EmailDto.DeleteTemplate) {
    try {
      await this.emailService.deleteTemplate(template);
      return 'Succeed!!';
    } catch (e: any) {
      throw e;
    }
  }

  @Get('/:id')
  async getTemplate(@Param() template: EmailDto.GetTemplate) {
    try {
      return await this.emailService.getTemplate(template);
    } catch (e: any) {
      throw e;
    }
  }
}
