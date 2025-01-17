import { registerAs } from '@nestjs/config';

export interface ISecretConfig {
  cookie: string;
  encryption: string;
  cloudinary_cloud_name: string;
  cloudinary_api_key: string;
  cloudinary_api_secret: string;
}

export const SecretConfig = registerAs(
  'secret',
  (): ISecretConfig => ({
    cookie: String(process.env.COOKIE_SECRET),
    encryption: String(process.env.ENCRYPTION_SECRET),
    cloudinary_cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME),
    cloudinary_api_key: String(process.env.CLOUDINARY_API_KEY),
    cloudinary_api_secret: String(process.env.CLOUDINARY_API_SECRET),
  }),
);
