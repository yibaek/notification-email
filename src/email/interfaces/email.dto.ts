import { Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EmailEnum } from '../enum/email.enum';

export namespace EmailDto {
  export class Message {
    @Expose()
    @IsNotEmpty()
    readonly traceId: string;

    @Expose()
    @IsEnum(EmailEnum.MessageType)
    @IsNotEmpty()
    readonly type: EmailEnum.MessageType;

    @Expose()
    @IsEnum(EmailEnum.Env)
    @IsOptional()
    readonly env: EmailEnum.Env = EmailEnum.Env.DEV;

    @Expose()
    @IsNumber()
    @IsOptional()
    readonly ver = 1;

    @Expose()
    @IsNotEmpty()
    readonly value: HtmlMessage | TemplateMessage;
  }

  export class CommonValue {
    @Expose()
    @IsString()
    @IsNotEmpty()
    readonly from: string;

    @Expose()
    @IsArray()
    @IsNotEmpty()
    readonly to: string[];

    @Expose()
    @IsString()
    @IsOptional()
    readonly charset = 'UTF-8';

    @Expose()
    @IsEnum(EmailEnum.Lang)
    @IsOptional()
    readonly lang: EmailEnum.Lang = EmailEnum.Lang.KO;

    @Expose()
    @IsArray()
    @IsNotEmpty()
    readonly contents: Record<any, any>[];
  }

  export class HtmlMessage extends CommonValue {
    @Expose()
    @IsString()
    @IsNotEmpty()
    readonly subject: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    readonly html: string;
  }

  export class TemplateMessage extends CommonValue {
    @Expose()
    @IsString()
    @IsNotEmpty()
    readonly templateId: string;
  }

  export class CreateTemplate {
    @Expose()
    @IsString()
    @IsNotEmpty()
    readonly id: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    readonly subject: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    readonly html: string;
  }

  export class UpdateTemplate extends CreateTemplate {}

  export class GetTemplate {
    @Expose()
    @IsString()
    @IsNotEmpty()
    readonly id: string;
  }

  export class DeleteTemplate extends GetTemplate {}
}
