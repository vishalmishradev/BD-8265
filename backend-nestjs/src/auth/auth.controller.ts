import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { registerDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { loginDTO } from './dto/login.dto';
import { Public } from './decorator/public.decorator';

@Public()
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() registerDto: registerDTO) {
    return await this.authService.register(registerDto);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: loginDTO) {
    return await this.authService.login(loginDto);
  }
}
