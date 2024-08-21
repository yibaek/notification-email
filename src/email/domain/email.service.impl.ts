import { EmailService } from './email.service';
import { Injectable } from '@nestjs/common';
import { EmailDto } from '../interfaces/email.dto';
import { SesService } from '../../common/ses/ses.service';
import { EmailEnum } from '../enum/email.enum';

@Injectable()
export class EmailServiceImpl implements EmailService {
  constructor(private readonly sesService: SesService) {}

  ////////////////////////////////////////////////
  //  Public Method
  ////////////////////////////////////////////////

  async sent(body: any): Promise<void> {
    try {
      const messages: EmailDto.Message[] | undefined = this.parseMessage(body);
      if (messages === undefined) {
        return;
      }

      await Promise.all(
        messages.map(async (message) => {
          await this.sentEmail(message);
        }),
      );
    } catch (e: any) {
      console.error(`[EmailService/sent()`, e);
    }
  }

  async createTemplate(template: EmailDto.CreateTemplate): Promise<void> {
    try {
      console.debug(`call createTemplate()`);
      await this.sesService.createTemplate(template);
    } catch (e: any) {
      console.error(`[EmailService/createTemplate()`, e);
    }
  }

  async updateTemplate(template: EmailDto.UpdateTemplate): Promise<void> {
    try {
      console.debug(`call updateTemplate()`);
      await this.sesService.updateTemplate(template);
    } catch (e: any) {
      console.error(`[EmailService/updateTemplate()`, e);
    }
  }

  async deleteTemplate(template: EmailDto.DeleteTemplate): Promise<void> {
    try {
      console.debug(`call deleteTemplate()`);
      await this.sesService.deleteTemplate(template);
    } catch (e: any) {
      console.error(`[EmailService/deleteTemplate()`, e);
    }
  }

  async getTemplate(
    template: EmailDto.GetTemplate,
  ): Promise<EmailDto.CreateTemplate> {
    try {
      console.debug(`call getCreatedTemplate()`);
      const result = await this.sesService.getTemplate(template);

      return {
        id: result.Template.TemplateName,
        subject: result.Template.SubjectPart,
        html: result.Template.HtmlPart,
      } as EmailDto.CreateTemplate;
    } catch (e: any) {
      console.error(`[EmailService/getCreatedTemplate()`, e);
    }
  }

  ////////////////////////////////////////////////
  //  Private Method
  ////////////////////////////////////////////////

  private async sentEmail(message: EmailDto.Message): Promise<void> {
    switch (message.type) {
      case EmailEnum.MessageType.HTML:
        await this.sesService.sendEmailWithHtml(message);
        break;
      case EmailEnum.MessageType.TEMPLATE:
        await this.sesService.sendEmailWithTemplate(message);
        break;
    }
  }

  private parseMessage(body: any): EmailDto.Message[] | undefined {
    try {
      return JSON.parse(
        Buffer.from(body.message.data, 'base64').toString('utf8'),
      ) as EmailDto.Message[];
    } catch (e: any) {
      console.error(`[EmailService/parseMessage()`, e);
      return undefined;
    }
  }
}
