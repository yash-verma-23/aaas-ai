import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailPasswordDto {
  /**
   * Email address of the user
   * @example john@yopmail.com
   */
  @IsEmail()
  email: string;

  /**
   * Password of the user
   * @example password
   */
  @IsNotEmpty()
  @IsString()
  password: string;
}
