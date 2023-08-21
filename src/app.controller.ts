import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUser } from './dto/update-user.dto';
import mongoose, { MongooseError } from 'mongoose';

export interface IQuery {
  name?: string;
  ageMin?: number;
  ageMax?: number;
  city?: string;
}

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async findAll(@Res() response): Promise<CreateUserDto[]> {
    try {
      const users = await this.appService.findAll();
      return response.status(200).json(users);
    } catch (error) {
      const err = error;
      if (error instanceof HttpException) {
        return response.status(err.status || 400).json(error);
      }
      return response.json(error);
    }
  }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() response,
  ): Promise<CreateUserDto> {
    try {
      const users = await this.appService.createUser(createUserDto);
      return response.status(200).json(users);
    } catch (error) {
      const err = error;
      if (error instanceof HttpException) {
        return response.status(err.status || 400).json(error);
      }
      return response.json(error);
    }
  }

  @Get('/search')
  async search(@Query() query: IQuery, @Res() response) {
    try {
      const users = await this.appService.searchUsers(query);
      return response.status(200).json(users);
    } catch (error) {
      const err = error;
      if (error instanceof HttpException) {
        return response.status(err.status || 400).json(error);
      }
      return response.json(error);
    }
  }

  @Patch(':id')
  async update(
    @Body() body: UpdateUser,
    @Param('id') id: string,
    @Res() response,
  ) {
    try {
      const user = await this.appService.update(id, body);
      if (!user)
        return response.status(400).json({ message: 'User updation failed..' });
      return response.status(200).json(user);
    } catch (error) {
      const err = error;
      if (error instanceof HttpException) {
        return response.status(err.status || 400).json(error);
      }
      if (error instanceof mongoose.Error.CastError) {
        return response
          .status(err.status || 404)
          .json({ message: 'User not found.' });
      }

      return response.json(error);
    }
  }
}
