import { Injectable } from "@nestjs/common";
import {
  createCipheriv,
  randomBytes,
  createDecipheriv,
  createHash,
} from 'crypto';

@Injectable()
export class EncryptionService {

  private algorithm: string;
  private key: string;

  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.key = createHash('sha256').update(process.env.ENCRYPTION_KEY).digest('base64').substring(0, 32);
  }

  encrypt(text: string) {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    const result = Buffer.concat([iv, cipher.update(text), cipher.final()]);
    return result.toString('base64');
  }

  decrypt(text: string) {
    let buf = Buffer.from(text, 'base64');
    const iv = buf.slice(0, 16);
    buf = buf.slice(16);
    const decipher = createDecipheriv(this.algorithm, this.key, iv);
    const result = Buffer.concat([decipher.update(buf), decipher.final()]);
    return result.toString();
  }
}