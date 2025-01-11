import { registerAs } from '@nestjs/config';
import { join } from 'path';

export interface IMailerConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  defaults: {
    from: string;
  };
  template: {
    dir: string;
    options: {
      strict: boolean;
    };
  };
}

export const MailerConfig = registerAs(
  'mailer',
  (): IMailerConfig => ({
    host: String(process.env.SMTP_HOST ?? 'smtp.gmail.com'),
    port: Number(parseInt(process.env.SMTP_PORT ?? '587', 10)),
    secure: Boolean(process.env.SMTP_SECURE === 'true'),
    auth: {
      user: String(process.env.SMTP_USER),
      pass: String(process.env.SMTP_PASS),
    },
    defaults: {
      from: '"No Reply" <no-reply@gmail.com>',
    },
    template: {
      dir: join(__dirname, './templates'),
      options: {
        strict: true,
      },
    },
  }),
);
