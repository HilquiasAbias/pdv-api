import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthDto } from './utils/dtos/auth.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth')
  auth(@Body() authDto: AuthDto) {
    return this.appService.auth(authDto);
  }
}
