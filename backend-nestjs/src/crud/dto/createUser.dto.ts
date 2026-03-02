import { IsString, IsInt, Min } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name: string;
  @IsInt()
  @Min(18)
  age: number;
}
