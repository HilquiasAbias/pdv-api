import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { FindAllDto } from '../utils/dtos/findAll.dto';
import { user } from '@prisma/client';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {

  constructor (private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    try {
      await this.prismaService.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: createUserDto.password,
          role: {
            connect: {
              name: createUserDto.role
            }
          }
        }
      });

      return;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(`Already exists: ${error.meta.target}`, HttpStatus.CONFLICT);
      } else {
        throw new HttpException("Something went wrong", HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  }

  async findAll(findAllDto: FindAllDto) {
    const previousLenght = findAllDto.previous * findAllDto.pageSize;
    const nextLenght = findAllDto.pageSize;
    const order = findAllDto.orderBy ? findAllDto.orderBy : {};
    const filter = findAllDto.where ? findAllDto.where : {};
    const select = findAllDto.select && findAllDto.select ? findAllDto.select : {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true
    };

    try {
      const user = await this.prismaService.user.findMany({
        skip: previousLenght,
        take: nextLenght,
        orderBy: order,
        where: filter,
        select: select,
      });

      const total = await this.prismaService.user.count({
        where: filter,
      });

      return {
        pageSize: findAllDto.pageSize,
        previous: findAllDto.previous,
        next: findAllDto.next,
        total,
        data: user
      };
    } catch (error) {
      console.log(error);
      throw new HttpException("Something went wrong", HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getForLogin(id: number) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          id: id
        },
        include: {
          role: true
        }
      });

      return user;
    } catch (error) {
      console.log(error);
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException("Something went wrong", HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  }

  async findOne(id: number) {    
    try {
      const user = await this.prismaService.user.findFirstOrThrow({
        where: {
          id: id
        }
      });      

      return {
        ...user,
        password: null
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException("Something went wrong", HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      let user: user;

      if (updateUserDto.role) {
        user = await this.prismaService.user.update({
          where: {
            id: id
          },
          data: {
            name: updateUserDto.name,
            email: updateUserDto.email,
            role: {
              connect: {
                name: updateUserDto.role
              }
            }
          }
        });
      } else {
        user = await this.prismaService.user.update({
          where: {
            id: id
          },
          data: {
            name: updateUserDto.name,
            email: updateUserDto.email
          }
        });
      }

      return {
        ...user,
        password: null
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException("Something went wrong", HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.user.delete({
        where: {
          id: id
        }
      });

      return;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException("Something went wrong", HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  }
}
