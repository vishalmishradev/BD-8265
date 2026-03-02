import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class registerDTO {
  @IsString()
  @Length(3, 20, { message: 'firstname must be 3-20 charcter only' })
  first_name: string;

  @IsString()
  @Length(3, 20, { message: 'lastname must be 3-20 charcter only' })
  last_name: string;

  @IsString()
  @Length(3, 30, { message: 'username must be 3-30 charcter only' })
  user_name: string;

  @IsString()
  @Length(8, 32, {
    message: 'Password must be 8-32 character!',
  })
  password: string;

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;
}
