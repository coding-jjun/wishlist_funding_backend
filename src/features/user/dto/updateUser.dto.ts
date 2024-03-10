import { IsNotEmpty } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    userNick: string;

    @IsNotEmpty()
    userPw: string;

    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    userPhone: string;

    @IsNotEmpty()
    userBirth: Date;

    @IsNotEmpty()
    userEmail: string;

    @IsNotEmpty()
    accId: number;

    @IsNotEmpty()
    userImg: number;
}