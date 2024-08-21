import { EmailDto } from '../interfaces/email.dto';

export const EmailService = Symbol('EmailService');

export interface EmailService {
  sent(body: any): Promise<void>;
  createTemplate(template: EmailDto.CreateTemplate): Promise<void>;
  updateTemplate(template: EmailDto.UpdateTemplate): Promise<void>;
  deleteTemplate(template: EmailDto.DeleteTemplate): Promise<void>;
  getTemplate(template: EmailDto.GetTemplate): Promise<EmailDto.CreateTemplate>;
}
