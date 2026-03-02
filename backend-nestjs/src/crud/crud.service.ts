import {
  Body,
  Injectable,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class CrudService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUser() {
    try {
      return await this.userRepository.find();
    } catch (err) {
      console.error(err);
      throw new Error('getting all user failed');
    }
  }

  async createUser(@Body() createUserDto: CreateUserDTO) {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (err) {
      console.error(err);
      throw new Error('create user failed');
    }
  }

  async getUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      const fetchedUser = await this.userRepository.findOneBy({ id });

      if (!fetchedUser) {
        throw new NotFoundException({
          success: false,
          message: `users with ${id} not found`,
        });
      }

      return fetchedUser;
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: `error -->  ${error?.message}`,
      };
    }
  }

  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto,
  ) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: `users with ${id} not found`,
        });
      }

      const updatedUser = await this.userRepository.update(
        { id },
        updateUserDto,
      );
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error('update user failed');
    }
  }

  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: `users with ${id} not found`,
        });
      }

      const deletedUser = await this.userRepository.delete(id);

      return { success: true, message: 'user deleted  successfully' };
    } catch (error) {
      console.error(error);
      throw new Error('deleting user failed');
    }
  }
}
