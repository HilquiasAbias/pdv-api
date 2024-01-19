import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './utils/auth.dto';

@Injectable()
export class AppService {

  constructor (private readonly prismaService: PrismaService) {}

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

    const passwordMatch = await bcrypt.compare(authDto.password, user.password);

    if (!passwordMatch) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }

    return {
      name: user.name,
      role: user.role.name,
    };
  }
}
