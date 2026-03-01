import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterRequest{
    @IsEmail({}, {message: 'Некорректный email'})
    @IsNotEmpty({message: 'Email не может быть пустым'})
    @IsString({message: 'Email должен быть строкой'})
    email: string;


    @IsNotEmpty({message: 'Имя не может быть пустым'})
    @IsString({message: 'Имя должно быть строкой'})
    @MinLength(2, {message: 'Имя должно быть не менее 2 символов'})
    @MaxLength(50, {message: 'Имя должно быть не более 50 символов'})
    name: string;

    @IsNotEmpty({message: 'Пароль не может быть пустым'})
    @IsString({message: 'Пароль должен быть строкой'})
    @MinLength(6, {message: 'Пароль должен быть не менее 6 символов'})
    @MaxLength(50, {message: 'Пароль должен быть не более 50 символов'})
    password: string;
}