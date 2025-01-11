import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto, JwtUserDto } from './dto/jwt.dto';

@Injectable()
export class JwtConfigService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signAsync<T extends Partial<JwtPayloadDto>>(payload: T, options?: JwtSignOptions): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

  async verifyAsync(token: string, options?: JwtSignOptions): Promise<JwtPayloadDto> {
    return this.jwtService.verifyAsync(token, options);
  }

  async decodeAsync(token: string): Promise<JwtUserDto> {
    return this.jwtService.decode(token);
  }

  bcryptHash(str: string) {
    return bcrypt.hash(str, 10);
  }

  bcryptCompare(str: string, hash: string) {
    return bcrypt.compare(str, hash);
  }

  // async encrypt(token: string) {
  //   const iv = randomBytes(16);

  //   const key = (await promisify(scrypt)(
  //     this.configService.get('secret.encryption_secret') as string,
  //     'salt',
  //     32,
  //   )) as Buffer;
  //   const cipher = createCipheriv('aes-256-ctr', key, iv);

  //   const encryptedText = Buffer.concat([cipher.update(token), cipher.final()]);
  //   return `${iv.toString('hex')}:${encryptedText.toString('hex')}`;
  // }

  // async decrypt(str: string) {
  //   const [iv, encryptedText] = str.split(':');
  //   const key = (await promisify(scrypt)(
  //     this.configService.get('secret.encryption_secret') as string,
  //     'salt',
  //     32,
  //   )) as Buffer;
  //   const decipher = createDecipheriv('aes-256-ctr', key, Buffer.from(iv, 'hex'));
  //   const decryptedText = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'hex')), decipher.final()]);

  //   return decryptedText.toString();
  // }
}
