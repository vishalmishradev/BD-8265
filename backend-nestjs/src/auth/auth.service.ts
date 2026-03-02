import {
  Body,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/entities/auth.entity';
import { Repository } from 'typeorm';
import { registerDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { loginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly authRepository: Repository<AuthUser>,
    private jwtService: JwtService,
  ) {}

  async register(@Body() registerDto: registerDTO) {
    try {
      const exsitingUser = await this.authRepository.findOne({
        where: { user_name: registerDto.user_name },
      });

      if (exsitingUser) {
        throw new ConflictException({
          success: false,
          message: 'username not available',
        });
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      let user = this.authRepository.create({
        ...registerDto,
        password: hashedPassword,
      });
      user = await this.authRepository.save(user);
      return {
        success: true,
        message: 'User registered Successfully',
        user,
      };
    } catch (error) {
      console.error(error?.message);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Something went wrong',
      });
    }
  }

  async login(@Body() loginDto: loginDTO) {
    try {
      const user = await this.authRepository.findOne({
        where: { user_name: loginDto.user_name },
      });

      if (!user) {
        throw new UnauthorizedException({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const isValidPass = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isValidPass) {
        throw new UnauthorizedException({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const token = await this.jwtService.signAsync({
        id: user.id,
        user_name: user.user_name,
        is_admin: user.is_admin,
      });

      return {
        success: true,
        message: 'login successful',
        token,
        isAdmin: user.is_admin,
      };
    } catch (error) {
      console.error(error.message);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Something went wrong',
      });
    }
  }
}
