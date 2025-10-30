import { IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
    @IsString()
    emailOrUsername: string; 

    @IsString()
    @MinLength(6)
    password: string; 
}