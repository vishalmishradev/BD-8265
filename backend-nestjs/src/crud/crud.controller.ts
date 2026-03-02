import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/createUser.dto';
import { CrudService } from './crud.service';
import { error } from 'console';
import { AdminOnly } from 'src/auth/decorator/roles.decorator';

@Controller('/crud')
export class CrudController {
  constructor(private readonly crudService: CrudService) {}

  @AdminOnly()
  @Get()
  async getAllUsers() {
    try {
      let users = await this.crudService.getAllUser();
      return {
        success: true,
        message: ' All users successfully fetched',
        users,
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Post()
  @HttpCode(201)
  async addUser(@Body() createUserDto: CreateUserDTO) {
    try {
      let newUser = await this.crudService.createUser(createUserDto);
      console.log(newUser);
      return { success: true, message: 'user added', user: newUser };
    } catch (err) {
      console.log(error);
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getUser(@Param('id', ParseIntPipe) id: number) {
    try {
      const fetchedUser = await this.crudService.getUserById(id);
      return { success: true, message: 'user fetched', user: fetchedUser };
    } catch (error) {
      console.log(error);
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto,
  ) {
    try {
      const user = await this.crudService.updateUser(id, updateUserDto);
      return { success: true, message: 'user updated successfully', user };
    } catch (err) {
      console.log(err);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    try {
      return await this.crudService.deleteUser(id);
    } catch (error) {
      console.error(error);
    }
  }
}
