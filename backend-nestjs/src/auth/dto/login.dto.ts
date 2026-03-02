import { IsString } from 'class-validator';

export class loginDTO {
  @IsString({ message: 'user_name not valid' })
  user_name: string;

  @IsString({ message: 'password not valid' })
  password: string;
}
