import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllDto } from '../utils/dtos/findAll.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { RolesConstant } from 'src/utils/constants/roles.constant';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(RolesConstant.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(RolesConstant.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('paginate')
  findAll(@Body() findAllDto: FindAllDto) {
    return this.usersService.findAll(findAllDto);
  }

  @Roles(RolesConstant.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Roles(RolesConstant.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(RolesConstant.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
