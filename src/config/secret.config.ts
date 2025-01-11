import { registerAs } from '@nestjs/config';

export interface ISecretConfig {
  cookie: string;
  encryption: string;
}

export const SecretConfig = registerAs(
  'secret',
  (): ISecretConfig => ({
    cookie: String(process.env.COOKIE_SECRET),
    encryption: String(process.env.ENCRYPTION_SECRET),
  }),
);
