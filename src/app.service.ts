import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthDto } from './utils/dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from './providers/encryption.service';

@Injectable()
export class AppService {

  constructor (
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService

  ) {}

  @Post()
  async auth(authDto: AuthDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        name: authDto.name,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const sub = this.encryptionService.encrypt(JSON.stringify({
      userId: user.id,
      role: user.role.name
    }));

    const response = {
      name: user.name,
      email: user.email,
      role: user.role.name,
      accessToken: this.jwtService.sign({ sub }),
    };
    
    return response;
  }
}
