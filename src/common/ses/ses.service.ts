import { Injectable } from '@nestjs/common';
import {
  CreateTemplateCommand,
  DeleteTemplateCommand,
  GetTemplateCommand,
  SendEmailCommand,
  SendTemplatedEmailCommand,
  SESClient,
  UpdateTemplateCommand,
} from '@aws-sdk/client-ses';
import { fromEnv } from '@aws-sdk/credential-providers';
import { EmailDto } from '../../email/interfaces/email.dto';
import { EmailEnum } from '../../email/enum/email.enum';
import Handlebars from 'handlebars';

@Injectable()
export class SesService {
  ////////////////////////////////////////////////
  //  Property
  ////////////////////////////////////////////////

  private client: SESClient | undefined;

  ////////////////////////////////////////////////
  //  Public Method
  ////////////////////////////////////////////////

  async sendEmailWithHtml(message: EmailDto.Message) {
    const value = message.value as EmailDto.HtmlMessage;

    await Promise.all(
      value.contents.map(async (content) => {
        try {
          return await this.getSesClient().send(
            await this.createSendEmailCommand(
              value.from,
              value.to,
              value.subject,
              value.html,
              content,
              value.charset,
            ),
          );
        } catch (e: any) {
          console.error(`[SesService/sendEmailWithHtml()`, e);
        }
      }),
    );
  }

  async sendEmailWithTemplate(message: EmailDto.Message) {
    const value = message.value as EmailDto.TemplateMessage;

    await Promise.all(
      value.contents.map(async (content) => {
        try {
          const templateId = this.makeTemplateId(message.env, value);

          return await this.getSesClient().send(
            await this.createSendTemplatedEmailCommand(
              value.from,
              value.to,
              templateId,
              content,
            ),
          );
        } catch (e: any) {
          console.error(`[SesService/sendEmailWithTemplate()`, e);
        }
      }),
    );
  }

  async createTemplate(template: EmailDto.CreateTemplate) {
    return await this.getSesClient().send(
      await this.createTemplateCommand(template),
    );
  }

  async updateTemplate(template: EmailDto.UpdateTemplate) {
    return await this.getSesClient().send(
      await this.updateTemplateCommand(template),
    );
  }

  async deleteTemplate(template: EmailDto.DeleteTemplate) {
    return await this.getSesClient().send(
      await this.deleteTemplateCommand(template),
    );
  }

  async getTemplate(template: EmailDto.GetTemplate) {
    return await this.getSesClient().send(
      await this.getTemplateCommand(template),
    );
  }

  ////////////////////////////////////////////////
  //  Private Method
  ////////////////////////////////////////////////

  private getSesClient() {
    if (!this.client) {
      this.client = new SESClient({
        credentials: fromEnv(),
      });
    }

    return this.client;
  }

  private async createSendEmailCommand(
    from: string,
    to: string[],
    subject: string,
    html: string,
    content: any,
    charset = 'UTF-8',
  ) {
    const subjectTemplate = this.compileToTemplate(subject, content);
    const htmlTemplate = this.compileToTemplate(html, content);

    return new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Body: {
          Html: {
            Charset: charset,
            Data: htmlTemplate,
          },
        },
        Subject: {
          Charset: charset,
          Data: subjectTemplate,
        },
      },
    });
  }

  private async createSendTemplatedEmailCommand(
    from: string,
    to: string[],
    templateId: string,
    templateData: Record<any, any>,
  ) {
    return new SendTemplatedEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: to,
      },
      Template: templateId,
      TemplateData: JSON.stringify(templateData),
    });
  }

  private compileToTemplate(source: string, content: any) {
    const template = Handlebars.compile(source);
    return template(content);
  }

  private async createTemplateCommand(template: EmailDto.CreateTemplate) {
    return new CreateTemplateCommand({
      Template: {
        TemplateName: template.id,
        SubjectPart: template.subject,
        HtmlPart: template.html,
      },
    });
  }

  private async updateTemplateCommand(template: EmailDto.UpdateTemplate) {
    return new UpdateTemplateCommand({
      Template: {
        TemplateName: template.id,
        SubjectPart: template.subject,
        HtmlPart: template.html,
      },
    });
  }

  private async deleteTemplateCommand(template: EmailDto.DeleteTemplate) {
    return new DeleteTemplateCommand({ TemplateName: template.id });
  }

  private async getTemplateCommand(template: EmailDto.GetTemplate) {
    return new GetTemplateCommand({ TemplateName: template.id });
  }

  private makeTemplateId(env: EmailEnum.Env, value: EmailDto.TemplateMessage) {
    return [env, value.templateId, value.lang].join('_');
  }
}
