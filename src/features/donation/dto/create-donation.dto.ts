import { IsNotEmpty, IsOptional, IsString, IsNumber } from "class-validator";
import { CreateGuestDto } from "./create-guest.dto";

export class CreateDonationDto {
    
    @IsOptional()
    guest: CreateGuestDto;

    @IsNumber()
    donAmnt: number;

    @IsNotEmpty()
    rollMsg: string;
}